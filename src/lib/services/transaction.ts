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
  const invoiceId = generateInvoiceId();
  const fee = calculateFee(input.price, input.paymentMethod);
  const discount = calculateDiscount(input.price, input.promoCode);
  const total = input.price + fee - discount;

  // Create transaction record (in production, save to DB via Prisma)
  const transaction: TransactionRecord = {
    id: crypto.randomUUID(),
    invoiceId,
    userId: input.userId,
    gameSlug: input.gameSlug,
    gameName: input.gameName,
    productCode: input.productCode,
    productName: input.productName,
    gameUserId: input.gameUserId,
    gameZoneId: input.gameZoneId,
    price: input.price,
    fee,
    discount,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: "PENDING",
    providerStatus: "idle",
    promoCode: input.promoCode,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // In production: save to database
  // await prisma.transaction.create({ data: transaction });

  console.log(
    `[Transaction] Created ${invoiceId}: ${input.gameName} - ${input.productName} = ${total}`
  );

  return transaction;
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
    // In production: call Apigames API
    // const result = await apigamesCreateOrder({
    //   productCode: transaction.productCode,
    //   userId: transaction.gameUserId,
    //   zoneId: transaction.gameZoneId,
    //   invoiceId: transaction.invoiceId,
    // });

    // Mock success for development
    const mockResult: ApigamesOrderResponse = {
      success: true,
      trxId: `AG-${Date.now()}`,
      refId: transaction.invoiceId,
      status: "success",
      message: "Topup berhasil diproses",
      sn: `SN${Date.now()}`,
    };

    // In production: update transaction in database
    // await prisma.transaction.update({
    //   where: { id: transaction.id },
    //   data: {
    //     providerStatus: mockResult.status,
    //     providerTrxId: mockResult.trxId,
    //     serialNumber: mockResult.sn,
    //     completedAt: mockResult.status === "success" ? new Date() : undefined,
    //   }
    // });

    console.log(
      `[Topup] ${transaction.invoiceId}: ${mockResult.status} (TrxID: ${mockResult.trxId})`
    );

    return {
      success: mockResult.success,
      providerTrxId: mockResult.trxId,
      serialNumber: mockResult.sn,
      message: mockResult.message,
    };
  } catch (error) {
    console.error(`[Topup] Failed for ${transaction.invoiceId}:`, error);

    return {
      success: false,
      message: "Gagal memproses topup. Akan dicoba ulang secara otomatis.",
    };
  }
}

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
