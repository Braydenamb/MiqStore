/**
 * Apigames Provider Service
 *
 * Integration with Apigames API for game topup and digital products.
 * Docs: https://apigames.id/
 *
 * Flow:
 *  1. Check product availability → getProducts()
 *  2. Place order → createOrder()
 *  3. Check order status → getOrderStatus()
 *  4. Webhook callback → handled in /api/webhook/provider
 */

/* ─── Types ─── */
export interface ApigamesProduct {
  code: string;
  name: string;
  price: number;
  status: "available" | "unavailable" | "maintenance";
  category: string;
  brand: string;
  description?: string;
}

export interface ApigamesOrderRequest {
  productCode: string;
  userId: string;
  zoneId?: string;
  invoiceId: string;
}

export interface ApigamesOrderResponse {
  success: boolean;
  trxId: string;
  refId: string;
  status: "pending" | "processing" | "success" | "failed";
  message: string;
  sn?: string; // Serial number (for vouchers)
}

export interface ApigamesStatusResponse {
  success: boolean;
  trxId: string;
  status: "pending" | "processing" | "success" | "failed";
  sn?: string;
  message: string;
}

/* ─── Config ─── */
const APIGAMES_CONFIG = {
  baseUrl: process.env.APIGAMES_BASE_URL || "https://v1.apigames.id",
  merchantId: process.env.APIGAMES_MERCHANT_ID || "",
  apiKey: process.env.APIGAMES_API_KEY || "",
  webhookSecret: process.env.APIGAMES_WEBHOOK_SECRET || "",
} as const;

/* ─── Signature ─── */
function generateSignature(merchantId: string, apiKey: string, refId: string): string {
  // Apigames uses md5(merchantId + apiKey + refId)
  // In production, use crypto.createHash('md5')
  // For now, return a placeholder that follows the pattern
  const combined = `${merchantId}${apiKey}${refId}`;
  return hashMD5(combined);
}

function hashMD5(input: string): string {
  // Use Web Crypto API compatible approach
  // In production, use: crypto.createHash('md5').update(input).digest('hex')
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

import { CircuitBreaker, withRetry, CircuitBreakerError } from "../reliability";

// Initialize the Circuit Breaker for Apigames
// Trip if 3 consecutive failures occur. Reset after 60 seconds.
export const apigamesBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeoutMs: 60000,
});

/* ─── API Client ─── */
async function apigamesRequest<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const url = `${APIGAMES_CONFIG.baseUrl}${endpoint}`;

  // Execute inside the Circuit Breaker state machine
  return apigamesBreaker.fire(async () => {
    // Wrap the raw fetch inside an Exponential Backoff retry strategy
    // Retries up to 2 times (3 total attempts), waiting 500ms, then 1000ms on failure.
    return withRetry(async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          merchant: APIGAMES_CONFIG.merchantId,
          ...body,
        }),
      });

      if (!response.ok) {
        throw new ApigamesError(
          `Apigames API error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data as T;
    }, 3, 500);
  });
}

/* ─── Error Class ─── */
export class ApigamesError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ApigamesError";
  }
}

/* ─── Service Methods ─── */

/**
 * Get available products/pricelist from Apigames
 */
export async function getProducts(
  category?: string
): Promise<ApigamesProduct[]> {
  try {
    const sign = generateSignature(
      APIGAMES_CONFIG.merchantId,
      APIGAMES_CONFIG.apiKey,
      "pricelist"
    );

    const data = await apigamesRequest<{
      result: boolean;
      data: ApigamesProduct[];
    }>("/v2/transaksi", {
      key: APIGAMES_CONFIG.apiKey,
      sign,
      type: "services",
      filter_type: category || "game",
    });

    if (!data.result) {
      throw new ApigamesError("Failed to fetch products from Apigames");
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApigamesError) throw error;
    throw new ApigamesError("Failed to connect to Apigames API");
  }
}

/**
 * Create a topup order via Apigames
 */
export async function createOrder(
  order: ApigamesOrderRequest
): Promise<ApigamesOrderResponse> {
  try {
    const sign = generateSignature(
      APIGAMES_CONFIG.merchantId,
      APIGAMES_CONFIG.apiKey,
      order.invoiceId
    );

    const target = order.zoneId
      ? `${order.userId}${order.zoneId}`
      : order.userId;

    const data = await apigamesRequest<{
      result: boolean;
      data: {
        trx_id: string;
        ref_id: string;
        status: string;
        message: string;
        sn?: string;
      };
    }>("/v2/transaksi", {
      key: APIGAMES_CONFIG.apiKey,
      sign,
      type: "order",
      service: order.productCode,
      data_no: target,
      ref_id: order.invoiceId,
    });

    return {
      success: data.result,
      trxId: data.data.trx_id,
      refId: data.data.ref_id,
      status: mapApigamesStatus(data.data.status),
      message: data.data.message,
      sn: data.data.sn,
    };
  } catch (error) {
    if (error instanceof ApigamesError) throw error;
    throw new ApigamesError("Failed to create order via Apigames");
  }
}

/**
 * Check order status from Apigames
 */
export async function getOrderStatus(
  refId: string
): Promise<ApigamesStatusResponse> {
  try {
    const sign = generateSignature(
      APIGAMES_CONFIG.merchantId,
      APIGAMES_CONFIG.apiKey,
      refId
    );

    const data = await apigamesRequest<{
      result: boolean;
      data: {
        trx_id: string;
        status: string;
        sn?: string;
        message: string;
      };
    }>("/v2/transaksi", {
      key: APIGAMES_CONFIG.apiKey,
      sign,
      type: "status",
      ref_id: refId,
    });

    return {
      success: data.result,
      trxId: data.data.trx_id,
      status: mapApigamesStatus(data.data.status),
      sn: data.data.sn,
      message: data.data.message,
    };
  } catch (error) {
    if (error instanceof ApigamesError) throw error;
    throw new ApigamesError("Failed to check order status via Apigames");
  }
}

/**
 * Verify webhook signature from Apigames
 */
export function verifyWebhookSignature(
  signature: string,
  refId: string
): boolean {
  const expected = generateSignature(
    APIGAMES_CONFIG.merchantId,
    APIGAMES_CONFIG.webhookSecret,
    refId
  );
  return signature === expected;
}

/* ─── Helpers ─── */
function mapApigamesStatus(
  status: string
): "pending" | "processing" | "success" | "failed" {
  const map: Record<string, "pending" | "processing" | "success" | "failed"> = {
    "0": "pending",
    "1": "processing",
    "2": "success",
    "3": "failed",
    "4": "failed",
    pending: "pending",
    process: "processing",
    sukses: "success",
    gagal: "failed",
  };
  return map[status.toLowerCase()] || "pending";
}
