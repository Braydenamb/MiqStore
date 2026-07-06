import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import {
  webhookLimiter,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { verifyWebhookSignature } from "@/lib/services/apigames";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/telemetry";

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
    const rateResult = await webhookLimiter.check(ip);
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
    const signature =
      req.headers.get("x-apigames-authorization") ||
      req.headers.get("x-signature") ||
      body.sign ||
      "";
      
    const isValid = verifyWebhookSignature(signature, ref_id);
    if (!isValid) {
      logger.warn("Invalid provider webhook signature", { refId: ref_id });
      return API_ERRORS.unauthorized();
    }

    // Map Apigames status to internal TransactionStatus
    const lowerStatus = String(status).toLowerCase();
    const statusMap: Record<string, string> = {
      "0": "PENDING",
      "1": "PROCESSING",
      "2": "SUCCESS",
      "3": "FAILED",
      "4": "REFUNDED",
      "pending": "PENDING",
      "proses": "PROCESSING",
      "process": "PROCESSING",
      "sukses": "SUCCESS",
      "sukses sebagian": "SUCCESS",
      "gagal": "FAILED",
      "error": "FAILED",
      "validasi provider": "PROCESSING",
    };
    const internalStatus = statusMap[lowerStatus] || "PENDING";

    // 1. Find transaction by ref_id (invoiceId)
    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId: ref_id },
    });

    if (!transaction) {
      logger.warn("Provider webhook transaction not found", { refId: ref_id });
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

    let finalStatus = internalStatus;
    let providerDataUpdate = {
      ...(transaction.providerData as Record<string, unknown> ?? {}),
      serialNumber: sn || "",
      providerMessage: message || "",
    };

    if (internalStatus === "FAILED" && (transaction.status === "PAID" || transaction.status === "PROCESSING")) {
      // OCC Lock
      const claimLock = await prisma.transaction.updateMany({
         where: { id: transaction.id, status: transaction.status },
         data: { status: "FAILED" }
      });
      if (claimLock.count === 0) return apiSuccess({ duplicate: true }, { message: "Race condition prevented" });

      try {
        const { refundTransaction } = await import("@/lib/services/duitku");
        await refundTransaction(ref_id, `Async Provider Failed: ${message}`);
        finalStatus = "REFUNDED";
        providerDataUpdate = { ...providerDataUpdate, needsRefund: false, refundStatus: "refunded_automatically" } as any;
        logger.info(`Automated async refund successful for ${ref_id}`);
      } catch (err) {
        logger.error(`Automated async refund failed for ${ref_id}`, { error: err instanceof Error ? err.message : err });
        providerDataUpdate = { ...providerDataUpdate, needsRefund: true, refundStatus: "pending_manual_refund" } as any;
      }
    }

    await prisma.transaction.updateMany({
      where: { id: transaction.id, status: transaction.status },
      data: {
        status: finalStatus as "PENDING" | "PAID" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED" | "EXPIRED",
        providerRef: trx_id || transaction.providerRef,
        providerData: providerDataUpdate,
        updatedAt: new Date(),
      },
    });

    logger.info("Provider webhook processed", {
      refId: ref_id,
      trxId: trx_id,
      internalStatus,
      serialNumber: sn || "-",
    });

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
  } catch (error) {
    logger.error("Provider Webhook fatal error", { error: error instanceof Error ? error.stack : error });
    return API_ERRORS.internal();
  }
}
