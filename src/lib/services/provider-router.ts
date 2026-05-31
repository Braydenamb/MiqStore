import { logger, metrics, tracing } from "../telemetry";

export interface TopupOrderResponse {
  success: boolean;
  providerName: string;
  providerTrxId?: string;
  serialNumber?: string;
  message: string;
  pricePaid?: number;
  latencyMs?: number;
}

export interface IProviderAdapter {
  name: string;
  checkStock(productCode: string): Promise<boolean>;
  getPrice(productCode: string): Promise<number>;
  ping(): Promise<number>; // Returns latency in ms
  createOrder(
    productCode: string,
    gameUserId: string,
    zoneId?: string,
    invoiceId?: string
  ): Promise<Omit<TopupOrderResponse, "providerName" | "latencyMs">>;
}

// ---------------------------------------------------------
// Mock Adapters (Simulating real-world variance)
// ---------------------------------------------------------

/** Sleep helper to simulate API latency */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ApigamesAdapter: IProviderAdapter = {
  name: "Apigames",
  async checkStock(productCode) {
    // 90% chance to have stock
    return Math.random() > 0.1;
  },
  async getPrice(productCode) {
    // Base price simulation ~ 10,000 IDR
    return 9500 + Math.floor(Math.random() * 1000);
  },
  async ping() {
    // Stable provider: 200ms - 800ms latency
    const ms = 200 + Math.floor(Math.random() * 600);
    await delay(50); // fast ping
    return ms;
  },
  async createOrder(productCode, gameUserId, zoneId, invoiceId) {
    await delay(500); // simulate API call
    return {
      success: true,
      providerTrxId: `AG-${Date.now()}`,
      serialNumber: `SN-AG-${Date.now()}`,
      message: "Order Success via Apigames",
    };
  },
};

export const DigiflazzAdapter: IProviderAdapter = {
  name: "Digiflazz",
  async checkStock(productCode) {
    // 95% chance to have stock
    return Math.random() > 0.05;
  },
  async getPrice(productCode) {
    // Very competitive price: ~ 9,400 IDR
    return 9400 + Math.floor(Math.random() * 800);
  },
  async ping() {
    // Sometimes slow provider: 300ms - 2500ms latency
    const ms = 300 + Math.floor(Math.random() * 2200);
    await delay(50);
    return ms;
  },
  async createOrder(productCode, gameUserId, zoneId, invoiceId) {
    await delay(500);
    return {
      success: true,
      providerTrxId: `DG-${Date.now()}`,
      serialNumber: `SN-DG-${Date.now()}`,
      message: "Order Success via Digiflazz",
    };
  },
};

export const VipResellerAdapter: IProviderAdapter = {
  name: "VipReseller",
  async checkStock(productCode) {
    // 80% chance to have stock
    return Math.random() > 0.2;
  },
  async getPrice(productCode) {
    // Most expensive usually: ~ 10,500 IDR
    return 10500 + Math.floor(Math.random() * 1000);
  },
  async ping() {
    // Ultra fast provider: 50ms - 200ms latency
    const ms = 50 + Math.floor(Math.random() * 150);
    await delay(50);
    return ms;
  },
  async createOrder(productCode, gameUserId, zoneId, invoiceId) {
    await delay(500);
    return {
      success: true,
      providerTrxId: `VIP-${Date.now()}`,
      serialNumber: `SN-VIP-${Date.now()}`,
      message: "Order Success via VipReseller",
    };
  },
};

// ---------------------------------------------------------
// Orchestrator Engine
// ---------------------------------------------------------

const ALL_PROVIDERS = [ApigamesAdapter, DigiflazzAdapter, VipResellerAdapter];

export async function routeTopupOrder(
  productCode: string,
  gameUserId: string,
  zoneId?: string,
  invoiceId?: string
): Promise<TopupOrderResponse> {
  const span = tracing.startSpan("route_topup_order", { invoiceId, productCode });
  logger.info(`Initiating Smart Route for ${invoiceId || "Unknown"}`);
  
  // 1. Check stock across all providers in parallel
  const stockResults = await Promise.all(
    ALL_PROVIDERS.map(async (p) => ({
      provider: p,
      inStock: await p.checkStock(productCode)
    }))
  );

  const availableProviders = stockResults.filter((r) => r.inStock).map((r) => r.provider);

  if (availableProviders.length === 0) {
    logger.error(`FATAL: Product ${productCode} is OUT OF STOCK on all providers!`, undefined, { invoiceId });
    metrics.increment("router_fatal_out_of_stock");
    span.end("error");
    return {
      success: false,
      providerName: "SYSTEM",
      message: "Out of stock on all networks. Please refund user.",
    };
  }

  // 2. Compare Prices
  const priceResults = await Promise.all(
    availableProviders.map(async (p) => ({
      provider: p,
      price: await p.getPrice(productCode)
    }))
  );

  // Sort by lowest price first
  priceResults.sort((a, b) => a.price - b.price);

  logger.debug(`Ranked Providers by Price: ${priceResults.map(p => `${p.provider.name} (Rp${p.price})`).join(' -> ')}`);

  // 3. Fallback Engine: Check latency sequentially down the list
  for (const candidate of priceResults) {
    const { provider, price } = candidate;
    
    logger.debug(`Testing primary candidate: ${provider.name}...`);
    const latency = await provider.ping();

    if (latency > 2000) {
      logger.warn(`Provider ${provider.name} is too slow (${latency}ms). Triggering fallback.`, { provider: provider.name, latency });
      metrics.increment(`router_latency_fallback_${provider.name.toLowerCase()}`);
      continue; // Fallback to next provider in loop
    }

    logger.info(`Provider selected!`, { provider: provider.name, latency, price });

    // 4. Execute Topup
    try {
      const startTime = Date.now();
      const order = await provider.createOrder(productCode, gameUserId, zoneId, invoiceId);
      const executionTime = Date.now() - startTime;
      
      span.end("success");
      return {
        success: order.success,
        providerName: provider.name,
        providerTrxId: order.providerTrxId,
        serialNumber: order.serialNumber,
        message: order.message,
        pricePaid: price,
        latencyMs: executionTime
      };
    } catch (e) {
      logger.error(`Execution failed for ${provider.name}! Trying fallback...`, e, { provider: provider.name });
      metrics.increment(`router_execution_failed_${provider.name.toLowerCase()}`);
      // Fall through to next provider loop if error
    }
  }

  // If all providers failed latency or execution checks
  span.end("error");
  metrics.increment("router_all_providers_failed");
  return {
    success: false,
    providerName: "SYSTEM",
    message: "All provider routes failed or timed out.",
  };
}
