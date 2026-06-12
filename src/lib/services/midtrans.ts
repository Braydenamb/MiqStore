/**
 * Midtrans Payment Gateway Service
 *
 * Integration with Midtrans Snap for payment processing.
 * Docs: https://docs.midtrans.com/
 *
 * Flow:
 *  1. Create snap transaction → createSnapTransaction()
 *  2. User pays via Midtrans modal
 *  3. Midtrans sends webhook → /api/webhook/payment
 *  4. Verify notification → verifyNotification()
 */

import crypto from "crypto";

/* ─── Types ─── */
export interface MidtransSnapRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemName: string;
  itemCategory: string;
  itemQuantity?: number;
  paymentMethod?: string;
}

export interface MidtransSnapResponse {
  token: string;
  redirectUrl: string;
}

export interface MidtransNotification {
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_status: string;
  fraud_status?: string;
  status_code: string;
  signature_key: string;
  transaction_time: string;
  settlement_time?: string;
}

export type MidtransTransactionStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "EXPIRED"
  | "REFUNDED"
  | "PROCESSING"
  | "SUCCESS";

/* ─── Config ─── */
const MIDTRANS_CONFIG = {
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
  isProduction: process.env.MIDTRANS_PRODUCTION === "true",
  get baseUrl() {
    return this.isProduction
      ? "https://app.midtrans.com"
      : "https://app.sandbox.midtrans.com";
  },
  get apiUrl() {
    return this.isProduction
      ? "https://api.midtrans.com"
      : "https://api.sandbox.midtrans.com";
  },
} as const;

/* ─── Error Class ─── */
export class MidtransError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "MidtransError";
  }
}

/* ─── Auth Header ─── */
function getAuthHeader(): string {
  const encoded = Buffer.from(`${MIDTRANS_CONFIG.serverKey}:`).toString("base64");
  return `Basic ${encoded}`;
}

/* ─── Service Methods ─── */

/**
 * Create a Snap transaction token for Midtrans payment popup
 */
export async function createSnapTransaction(
  request: MidtransSnapRequest
): Promise<MidtransSnapResponse> {
  try {
    const paymentMethodMap: Record<string, string[]> = {
      "qris": ["qris", "gopay"],
      "gopay": ["gopay"],
      "shopeepay": ["shopeepay"],
      "bca-va": ["bca_va"],
      "bni-va": ["bni_va"],
      "bri-va": ["bri_va"],
      "mandiri-va": ["echannel"],
      "indomaret": ["indomaret"],
      "alfamart": ["alfamart"],
      // For ovo/dana or others without direct snap mapping, we'll just not filter
    };

    const enabledPayments = request.paymentMethod ? paymentMethodMap[request.paymentMethod] : undefined;

    const snapPayload: any = {
      transaction_details: {
        order_id: request.orderId,
        gross_amount: request.amount,
      },
      item_details: [
        {
          id: request.orderId,
          name: request.itemName,
          price: request.amount,
          quantity: request.itemQuantity || 1,
          category: request.itemCategory,
        },
      ],
      customer_details: {
        first_name: request.customerName,
        email: request.customerEmail,
        phone: request.customerPhone || "",
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/invoice/${request.orderId}`,
        error: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/invoice/${request.orderId}`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/invoice/${request.orderId}`,
      },
      expiry: {
        unit: "hours",
        duration: 24,
      },
    };

    if (enabledPayments && enabledPayments.length > 0) {
      snapPayload.enabled_payments = enabledPayments;
    }

    const response = await fetch(`${MIDTRANS_CONFIG.baseUrl}/snap/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(snapPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new MidtransError(
        `Midtrans API error: ${JSON.stringify(errorData)}`,
        response.status
      );
    }

    const data = await response.json();

    return {
      token: data.token,
      redirectUrl: data.redirect_url,
    };
  } catch (error) {
    if (error instanceof MidtransError) throw error;
    throw new MidtransError("Failed to create Midtrans transaction");
  }
}

/**
 * Verify webhook notification signature from Midtrans
 *
 * Signature = SHA512(order_id + status_code + gross_amount + server_key)
 */
export function verifyNotificationSignature(
  notification: MidtransNotification
): boolean {
  if (!MIDTRANS_CONFIG.serverKey) {
    console.warn("[Midtrans] Server key not configured, skipping signature verification");
    return true; // Allow in dev
  }

  const signatureInput = [
    notification.order_id,
    notification.status_code,
    notification.gross_amount,
    MIDTRANS_CONFIG.serverKey,
  ].join("");

  const expectedSignature = crypto
    .createHash("sha512")
    .update(signatureInput)
    .digest("hex");

  return expectedSignature === notification.signature_key;
}

/**
 * Map Midtrans transaction_status to internal status
 */
export function mapTransactionStatus(
  transactionStatus: string,
  fraudStatus?: string
): MidtransTransactionStatus {
  // If fraud detected
  if (fraudStatus === "deny") return "FAILED";

  const statusMap: Record<string, MidtransTransactionStatus> = {
    capture: fraudStatus === "accept" ? "PAID" : "PENDING",
    settlement: "PAID",
    pending: "PENDING",
    deny: "FAILED",
    cancel: "FAILED",
    expire: "EXPIRED",
    refund: "REFUNDED",
    partial_refund: "REFUNDED",
    failure: "FAILED",
  };

  return statusMap[transactionStatus] || "PENDING";
}

/**
 * Get transaction status from Midtrans API
 */
export async function getTransactionStatus(orderId: string) {
  try {
    const response = await fetch(
      `${MIDTRANS_CONFIG.apiUrl}/v2/${orderId}/status`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      throw new MidtransError(
        `Failed to get transaction status: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof MidtransError) throw error;
    throw new MidtransError("Failed to check Midtrans transaction status");
  }
}

/**
 * Get Midtrans client key for frontend Snap.js
 */
export function getClientKey(): string {
  return MIDTRANS_CONFIG.clientKey;
}

/**
 * Check if Midtrans is configured
 */
export function isConfigured(): boolean {
  return !!(MIDTRANS_CONFIG.serverKey && MIDTRANS_CONFIG.clientKey);
}
