/**
 * Duitku Payment Gateway Service
 * Integration with Duitku API v2.
 */

import crypto from "crypto";
import { logger } from "../telemetry";

export interface DuitkuPaymentRequest {
  merchantOrderId: string;
  paymentAmount: number;
  productDetails: string;
  email: string;
  phoneNumber?: string;
  customerVaName: string;
  paymentMethod: string;
  itemDetails: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  customerDetail: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
}

export interface DuitkuPaymentResponse {
  success: boolean;
  paymentUrl: string;
  reference: string;
  vaNumber?: string;
  message?: string;
}

export interface DuitkuNotification {
  merchantCode: string;
  amount: string;
  merchantOrderId: string;
  productDetail: string;
  additionalParam?: string;
  paymentCode: string;
  resultCode: string;
  merchantUserId?: string;
  reference: string;
  signature: string;
  publisherOrderId?: string;
  spUserHash?: string;
  settlementDate?: string;
  issuerCode?: string;
}

export type DuitkuTransactionStatus = "PENDING" | "PAID" | "EXPIRED" | "FAILED";

const DUITKU_CONFIG = {
  merchantCode: process.env.DUITKU_MERCHANT_CODE || "",
  apiKey: process.env.DUITKU_API_KEY || "",
  isProduction: process.env.DUITKU_PRODUCTION === "true",
};

const getBaseUrl = () => {
  return DUITKU_CONFIG.isProduction
    ? "https://passport.duitku.com/webapi"
    : "https://sandbox.duitku.com/webapi";
};

/**
 * Generate Duitku Signature for Inquiry
 * stringToSign = merchantCode + merchantOrderId + paymentAmount
 */
function generateInquirySignature(merchantOrderId: string, paymentAmount: number): string {
  const stringToSign = `${DUITKU_CONFIG.merchantCode}${merchantOrderId}${paymentAmount}`;
  return crypto.createHmac("sha256", DUITKU_CONFIG.apiKey).update(stringToSign).digest("hex");
}

/**
 * Generate Duitku Signature for Callback
 * stringToSign = merchantCode + amount + merchantOrderId
 */
export function generateCallbackSignature(amount: string | number, merchantOrderId: string): string {
  const stringToSign = `${DUITKU_CONFIG.merchantCode}${amount}${merchantOrderId}`;
  return crypto.createHmac("sha256", DUITKU_CONFIG.apiKey).update(stringToSign).digest("hex");
}

/**
 * Generate Duitku Signature for Check Transaction
 * stringToSign = merchantCode + merchantOrderId
 */
export function generateCheckSignature(merchantOrderId: string): string {
  const stringToSign = `${DUITKU_CONFIG.merchantCode}${merchantOrderId}`;
  return crypto.createHmac("sha256", DUITKU_CONFIG.apiKey).update(stringToSign).digest("hex");
}

/**
 * Create Payment Session
 */
export async function createDuitkuTransaction(req: DuitkuPaymentRequest): Promise<DuitkuPaymentResponse> {
  const baseUrl = getBaseUrl();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://miqstore.online";

  const signature = generateInquirySignature(req.merchantOrderId, req.paymentAmount);

  const body = {
    merchantCode: DUITKU_CONFIG.merchantCode,
    paymentAmount: req.paymentAmount,
    paymentMethod: req.paymentMethod,
    merchantOrderId: req.merchantOrderId,
    productDetails: req.productDetails,
    customerVaName: req.customerVaName,
    email: req.email,
    phoneNumber: req.phoneNumber || "",
    itemDetails: req.itemDetails,
    customerDetail: req.customerDetail,
    callbackUrl: `${siteUrl}/api/webhook/payment`,
    returnUrl: `${siteUrl}/invoice/${req.merchantOrderId}`,
    signature: signature,
    expiryPeriod: 60 // Default 60 minutes
  };

  try {
    const response = await fetch(`${baseUrl}/api/merchant/v2/inquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && data.statusCode === "00") {
      return {
        success: true,
        paymentUrl: data.paymentUrl,
        reference: data.reference,
        vaNumber: data.vaNumber,
      };
    } else {
      logger.error("Duitku create error", { data });
      return {
        success: false,
        paymentUrl: "",
        reference: "",
        message: data.statusMessage || "Failed to create payment",
      };
    }
  } catch (error) {
    logger.error("Duitku API Exception", { error: String(error) });
    return {
      success: false,
      paymentUrl: "",
      reference: "",
      message: "API Request Failed",
    };
  }
}

/**
 * Get Transaction Status for Reconciliation
 */
export async function getDuitkuTransactionStatus(merchantOrderId: string): Promise<any> {
  const baseUrl = getBaseUrl();
  const signature = generateCheckSignature(merchantOrderId);
  
  const body = new URLSearchParams({
    merchantCode: DUITKU_CONFIG.merchantCode,
    merchantOrderId: merchantOrderId,
    signature: signature
  });

  try {
    const response = await fetch(`${baseUrl}/api/merchant/transactionStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Duitku Status Exception", { error: String(error) });
    return null;
  }
}

/**
 * Map Duitku resultCode to Internal Status
 * 00 - Success
 * 01 - Pending / Failed
 * 02 - Canceled
 */
export function mapTransactionStatus(resultCode: string): DuitkuTransactionStatus {
  if (resultCode === "00") return "PAID";
  if (resultCode === "01") return "FAILED"; // Treat 01 as failed for webhook updates
  if (resultCode === "02") return "EXPIRED";
  return "PENDING";
}

/**
 * Manual refund required for Duitku
 */
export async function refundTransaction(invoiceId: string, reason: string): Promise<boolean> {
  logger.warn("[ALERT] Manual refund required for Duitku", { invoiceId, reason });
  return false;
}
