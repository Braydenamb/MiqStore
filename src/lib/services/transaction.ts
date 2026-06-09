/**
 * Transaction Orchestrator
 *
 * Coordinates the full lifecycle of a topup transaction:
 *  1. Validate input
 *  2. Create payment via Midtrans
 *  3. Store transaction in DB (pending)
 *  4. On payment confirmed → Place order via Apigames
 *  5. On topup confirmed → Mark as success
 *
 * This is the central service that connects payment ↔ provider.
 */

import { prisma } from "@/lib/prisma";
// import { debitWallet } from "./wallet"; // OUT OF SCOPE
// ai-brain removed
import { logger, metrics, tracing } from "../telemetry";
import { eventBus } from "./event-bus";
import { registerSystemSubscribers } from "./subscribers";
import { routeTopupOrder } from "./provider-router";

// Boot the background event workers exactly once when this module loads
registerSystemSubscribers();
import {
  verifyNotificationSignature,
  mapTransactionStatus,
  type MidtransNotification,
  type MidtransTransactionStatus,
} from "./midtrans";
import type { ApigamesOrderResponse } from "./apigames";

/* ─── Types ─── */
export interface CreateTransactionInput {
  userId: string;
  gameSlug: string;
  gameName: string;
  productCode: string;
  productName: string;
  gameUserId: string;
  gameZoneId?: string;
  price: number;
  paymentMethod: string;
  promoCode?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface TransactionRecord {
  id: string;
  invoiceId: string;
  userId: string;
  gameSlug: string;
  gameName: string;
  productCode: string;
  productName: string;
  gameUserId: string;
  gameZoneId?: string;
  price: number;
  fee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: MidtransTransactionStatus;
  providerStatus: "idle" | "pending" | "processing" | "success" | "failed";
  providerTrxId?: string;
  serialNumber?: string;
  snapToken?: string;
  snapUrl?: string;
  promoCode?: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  completedAt?: Date;
}

/* ─── Fee Calculation ─── */
const PAYMENT_FEES: Record<string, { type: "flat" | "percent"; value: number }> = {
  wallet: { type: "flat", value: 0 },
  qris: { type: "percent", value: 0.7 },
  gopay: { type: "percent", value: 2 },
  ovo: { type: "flat", value: 1000 },
  dana: { type: "flat", value: 1000 },
  shopeepay: { type: "percent", value: 1.5 },
  bca_va: { type: "flat", value: 4000 },
  bni_va: { type: "flat", value: 4000 },
  bri_va: { type: "flat", value: 4000 },
  mandiri_va: { type: "flat", value: 4000 },
  permata_va: { type: "flat", value: 4000 },
  indomaret: { type: "flat", value: 2500 },
  alfamart: { type: "flat", value: 2500 },
};

const PROMO_CODES: Record<string, number> = {
  MIQ10: 0.1,
  FLASHSALE: 0.1,
  NEWUSER: 0.15,
  MEMBER20: 0.2,
};

export function calculateFee(price: number, paymentMethod: string): number {
  const feeConfig = PAYMENT_FEES[paymentMethod];
  if (!feeConfig) return 0;

  return feeConfig.type === "flat"
    ? feeConfig.value
    : Math.round(price * (feeConfig.value / 100));
}

export function calculateDiscount(price: number, promoCode?: string): number {
  if (!promoCode) return 0;
  const rate = PROMO_CODES[promoCode.toUpperCase()];
  return rate ? Math.round(price * rate) : 0;
}

/* ─── Invoice ID Generator ─── */
function generateInvoiceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${timestamp}${random}`;
}

/* ─── Orchestrator Methods ─── */

/**
 * Step 1: Create a new transaction and get payment token
 */
export async function createTransaction(
  input: CreateTransactionInput
): Promise<TransactionRecord> {
  const span = tracing.startSpan("create_transaction");

  // Risk Engine check removed

  const invoiceId = generateInvoiceId();
  const fee = calculateFee(input.price, input.paymentMethod);
  const discount = calculateDiscount(input.price, input.promoCode);
  const total = input.price + fee - discount;

  // Persist to database — payment method lives on the Payment model, not Transaction
  const transaction = await prisma.transaction.create({
    data: {
      invoiceId,
      userId: input.userId,
      productId: "PENDING_PRODUCT", // Placeholder until seed logic maps these
      productItemId: "PENDING_ITEM",
      price: input.price,
      fee,
      discount,
      total,
      status: "PENDING",
      gameUserId: input.gameUserId,
      gameZoneId: input.gameZoneId,
      payment: {
        create: {
          gateway: "midtrans",
          method: input.paymentMethod,
          amount: total,
          status: "PENDING",
        },
      },
    },
    include: { payment: true },
  });

  logger.info(`Transaction Created: ${invoiceId}`, { 
    game: input.gameName, 
    total, 
    paymentMethod: input.paymentMethod 
  });
  
  metrics.increment("transaction_created");
  span.end("success");

  return transaction as unknown as TransactionRecord;
}

/**
 * Step 2: Handle payment webhook from Midtrans
 *
 * Called when Midtrans sends payment status update.
 * If payment is confirmed, trigger topup via Apigames.
 */
export async function handlePaymentWebhook(
  notification: MidtransNotification
): Promise<{
  orderId: string;
  paymentStatus: MidtransTransactionStatus;
  shouldTriggerTopup: boolean;
}> {
  // Verify signature
  const isValid = verifyNotificationSignature(notification);
  if (!isValid) {
    throw new Error("Invalid webhook signature");
  }

  const paymentStatus = mapTransactionStatus(
    notification.transaction_status,
    notification.fraud_status
  );

  // In production: update transaction in database
  // await prisma.transaction.update({
  //   where: { invoiceId: notification.order_id },
  //   data: { paymentStatus, paidAt: paymentStatus === "PAID" ? new Date() : undefined }
  // });

  console.log(
    `[Webhook] Payment ${notification.order_id}: ${notification.transaction_status} → ${paymentStatus}`
  );

  return {
    orderId: notification.order_id,
    paymentStatus,
    shouldTriggerTopup: paymentStatus === "PAID",
  };
}

/**
 * Step 3: Process topup via Apigames after payment confirmed
 */
export async function processTopup(
  transaction: TransactionRecord
): Promise<{
  success: boolean;
  providerTrxId?: string;
  serialNumber?: string;
  message: string;
}> {
  try {
    // 🔥 Delegate to Smart Provider Routing Engine 🔥
    const order = await routeTopupOrder(
      transaction.productCode,
      transaction.gameUserId,
      transaction.gameZoneId,
      transaction.invoiceId
    );

    if (order.success) {
      logger.info(`Smart Route Selected: ${order.providerName}`, {
        invoiceId: transaction.invoiceId,
        providerTrxId: order.providerTrxId
      });
      metrics.increment(`topup_success_${order.providerName.toLowerCase()}`);
    } else {
      logger.error(`Smart Route Failed: ${order.message}`, undefined, { invoiceId: transaction.invoiceId });
      metrics.increment("topup_failed_all_providers");
    }

    return {
      success: order.success,
      providerTrxId: order.providerTrxId,
      serialNumber: order.serialNumber,
      message: order.message,
    };
  } catch (error) {
    logger.error(`Critical Failure processing topup for ${transaction.invoiceId}`, error);
    metrics.increment("topup_critical_failure");

    return {
      success: false,
      message: "Gagal memproses topup. Sistem sedang down.",
    };
  }
}

/**
 * Step 4 (Wallet Ecosystem): Instant Checkout via Internal Wallet
 * Bypasses Midtrans completely.
 * (OUT OF SCOPE FOR MVP)
 */
// export async function handleWalletCheckout(
//   input: CreateTransactionInput
// ): Promise<TransactionRecord> {
//   const transaction = await createTransaction(input);

//   if (transaction.paymentMethod.toLowerCase() !== "wallet") {
//     throw new Error("Invalid payment method for wallet checkout");
//   }

//   // 1. Debit Wallet
//   await debitWallet(
//     transaction.userId,
//     transaction.total,
//     "PURCHASE",
//     `Payment for ${transaction.invoiceId} - ${transaction.gameName}`,
//     transaction.invoiceId
//   );

//   // 2. Mark as PAID instantly
//   transaction.paymentStatus = "PAID";
//   transaction.paidAt = new Date();
  
//   console.log(`[Wallet Checkout] Instant payment successful for ${transaction.invoiceId}`);

//   // 3. Trigger Topup
//   const topupResult = await processTopup(transaction);
  
//   if (topupResult.success) {
//     transaction.providerStatus = "success";
//     transaction.completedAt = new Date();
    
//     // 🔥 Fire & Forget: Broadcast to decoupled workers
//     eventBus.publish("TRANSACTION_COMPLETED", { transaction });
//   } else {
//     transaction.providerStatus = "pending";
//   }

//   return transaction;
// }


/**
 * Get transaction summary for dashboard/analytics
 */
export function getTransactionSummary(transactions: TransactionRecord[]) {
  const total = transactions.length;
  const success = transactions.filter((t) => t.providerStatus === "success").length;
  const pending = transactions.filter((t) => t.paymentStatus === "PENDING").length;
  const failed = transactions.filter((t) => t.paymentStatus === "FAILED").length;
  const revenue = transactions
    .filter((t) => t.paymentStatus === "PAID")
    .reduce((sum, t) => sum + t.total, 0);

  return {
    total,
    success,
    pending,
    failed,
    successRate: total > 0 ? ((success / total) * 100).toFixed(1) : "0",
    revenue,
  };
}
