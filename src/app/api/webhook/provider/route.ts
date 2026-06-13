import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import {
  webhookLimiter,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { verifyWebhookSignature } from "@/lib/services/apigames";
import { prisma } from "@/lib/prisma";
import { eventBus } from "@/lib/services/event-bus";

/**
 * POST /api/webhook/provider
 *
 * Handle topup status callbacks from Apigames.
 * Called when topup order changes status (processing → success/failed).
 *
 * Security:
 *  1. Rate limiting (100 req/min)
 *  2. Signature verification
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIP(req);
    const rateResult = webhookLimiter.check(ip);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, webhookLimiter);
    }

    const body = await req.json();
    const { ref_id, trx_id, status, sn, message } = body;

    if (!ref_id || !status) {
      return API_ERRORS.validation({
        ref_id: !ref_id ? ["ref_id wajib"] : [],
        status: !status ? ["status wajib"] : [],
      });
    }

    // Verify signature from Apigames
    const signature = req.headers.get("x-signature") || body.sign || "";
    const isValid = verifyWebhookSignature(signature, ref_id);
    if (!isValid) {
      console.warn(`[Provider Webhook] Invalid signature for ref: ${ref_id}`);
      return API_ERRORS.unauthorized();
    }

    // Map Apigames status to internal TransactionStatus
    const statusMap: Record<string, string> = {
      "0": "PENDING",
      "1": "PROCESSING",
      "2": "SUCCESS",
      "3": "FAILED",
      "4": "REFUNDED",
    };
    const internalStatus = statusMap[status] || "PENDING";

    // 1. Find transaction by ref_id (invoiceId)
    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId: ref_id },
    });

    if (!transaction) {
      console.warn(`[Provider Webhook] Transaction not found: ${ref_id}`);
      // Still return 200 to prevent gateway retries
      return apiSuccess(
        { refId: ref_id, status: internalStatus, note: "Transaction not found" },
        { message: "Webhook received but transaction not found" }
      );
    }

    // 2. Idempotency: skip if already at terminal SUCCESS/FAILED state
    if (transaction.status === "SUCCESS" || transaction.status === "FAILED") {
      return apiSuccess(
        { refId: ref_id, status: transaction.status, duplicate: true },
        { message: "Already processed" }
      );
    }

    // 3. Update transaction with provider status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: internalStatus as "PENDING" | "PAID" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED" | "EXPIRED",
        providerRef: trx_id || transaction.providerRef,
        providerData: {
          ...(transaction.providerData as Record<string, unknown> ?? {}),
          serialNumber: sn || "",
          providerMessage: message || "",
        },
        updatedAt: new Date(),
      },
    });

    // 4. Fire event for completed transactions
    if (internalStatus === "SUCCESS") {
      eventBus.emit("TRANSACTION_COMPLETED", {
        transaction: {
          invoiceId: ref_id,
          providerStatus: "success",
        },
      });
    }

    console.log(
      `[Provider Webhook] Ref: ${ref_id}, TrxID: ${trx_id}, Status: ${status} → ${internalStatus}, SN: ${sn || "-"}`
    );

    return apiSuccess(
      {
        refId: ref_id,
        trxId: trx_id,
        status: internalStatus,
        processedAt: new Date().toISOString(),
      },
      {
        message: "Provider webhook processed",
        headers: webhookLimiter.headers(rateResult),
      }
    );
  } catch {
    return API_ERRORS.internal();
  }
}
