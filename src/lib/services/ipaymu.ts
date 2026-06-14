/**
 * iPaymu Payment Gateway Service
 * Integration with iPaymu v2 API.
 */

import crypto from "crypto";
import { logger } from "../telemetry";

export interface IpaymuPaymentRequest {
  referenceId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  itemName: string;
  paymentMethod?: string;
}

export interface IpaymuPaymentResponse {
  success: boolean;
  sessionId: string;
  url: string;
  message?: string;
}

export interface IpaymuNotification {
  trx_id: string;
  status: string;
  status_code: string;
  sid: string;
  reference_id: string;
  amount: string;
  via: string;
  channel: string;
  signature?: string;
}

export type IpaymuTransactionStatus = "PENDING" | "PAID" | "EXPIRED" | "FAILED" | "PROCESSING" | "REFUNDED";

const IPAYMU_CONFIG = {
  va: process.env.IPAYMU_VA || "",
  apiKey: process.env.IPAYMU_API_KEY || "",
  isProduction: process.env.IPAYMU_PRODUCTION === "true",
};

const getBaseUrl = () => {
  return IPAYMU_CONFIG.isProduction
    ? "https://my.ipaymu.com"
    : "https://sandbox.ipaymu.com";
};

/**
 * Generate iPaymu Signature
 */
function generateSignature(body: Record<string, any>): string {
  const bodyString = JSON.stringify(body);
  const bodyHash = crypto.createHash("sha256").update(bodyString).digest("hex");
  const stringToSign = `POST:${IPAYMU_CONFIG.va}:${bodyHash}:${IPAYMU_CONFIG.apiKey}`;
  return crypto.createHmac("sha256", IPAYMU_CONFIG.apiKey).update(stringToSign).digest("hex");
}

/**
 * Create Payment Session
 */
export async function createIpaymuTransaction(req: IpaymuPaymentRequest): Promise<IpaymuPaymentResponse> {
  const baseUrl = getBaseUrl();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://miqstore.online";

  const body = {
    account: IPAYMU_CONFIG.va,
    product: [req.itemName],
    qty: ["1"],
    price: [req.amount.toString()],
    returnUrl: `${siteUrl}/invoice/${req.referenceId}`,
    notifyUrl: `${siteUrl}/api/webhook/payment`,
    cancelUrl: `${siteUrl}/invoice/${req.referenceId}`,
    referenceId: req.referenceId,
    buyerName: req.customerName,
    buyerEmail: req.customerEmail || "no-email@miqstore.online",
  };

  const signature = generateSignature(body);
  
  // Format: YYYYMMDDHHMMSS
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);

  try {
    const response = await fetch(`${baseUrl}/api/v2/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "va": IPAYMU_CONFIG.va,
        "signature": signature,
        "timestamp": timestamp,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.Success) {
      return {
        success: true,
        sessionId: data.Data.SessionID,
        url: data.Data.Url,
      };
    } else {
      logger.error("iPaymu create error", { data });
      return {
        success: false,
        sessionId: "",
        url: "",
        message: data.Message || "Failed to create payment",
      };
    }
  } catch (error) {
    logger.error("iPaymu API Exception", { error: String(error) });
    return {
      success: false,
      sessionId: "",
      url: "",
      message: "API Request Failed",
    };
  }
}

/**
 * Get Transaction Status for Reconciliation
 */
export async function getIpaymuTransactionStatus(transactionId: string): Promise<any> {
  const baseUrl = getBaseUrl();
  const body = { transactionId };
  const signature = generateSignature(body);
  
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);

  try {
    const response = await fetch(`${baseUrl}/api/v2/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "va": IPAYMU_CONFIG.va,
        "signature": signature,
        "timestamp": timestamp,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("iPaymu Status Exception", { error: String(error) });
    return null;
  }
}

/**
 * Map iPaymu status to Internal Status
 * iPaymu status codes: 
 * 1 (Berhasil), 6 (Berhasil - Unsettled), 7 (Escrow) => PAID
 * 0 (Pending) => PENDING
 * -2 (Expired) => EXPIRED
 * 2 (Batal), 3 (Refund), 4 (Error), 5 (Gagal) => FAILED
 */
export function mapTransactionStatus(statusCode: string | number): IpaymuTransactionStatus {
  const code = String(statusCode);
  if (["1", "6", "7"].includes(code)) return "PAID";
  if (code === "0") return "PENDING";
  if (code === "-2" || code === "expired") return "EXPIRED";
  if (["2", "3", "4", "5", "-1"].includes(code)) return "FAILED";
  return "PENDING";
}

/**
 * Dummy Refund Method (iPaymu does not support automated API refunds in v2 natively without manual portal action, but we mock it for the interface)
 */
export async function refundTransaction(invoiceId: string, reason: string): Promise<boolean> {
  logger.warn("[ALERT] Manual refund required for iPaymu", { invoiceId, reason });
  // iPaymu requires manual refund from their dashboard.
  return false;
}
