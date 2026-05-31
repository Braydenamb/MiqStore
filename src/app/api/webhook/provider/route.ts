import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import {
  webhookLimiter,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { verifyWebhookSignature } from "@/lib/services/apigames";

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

    // Map Apigames status
    const statusMap: Record<string, string> = {
      "0": "PENDING",
      "1": "PROCESSING",
      "2": "SUCCESS",
      "3": "FAILED",
      "4": "REFUNDED",
    };
    const internalStatus = statusMap[status] || "PENDING";

    // In production:
    // 1. Find transaction by ref_id (invoiceId)
    // const transaction = await prisma.transaction.findUnique({
    //   where: { invoiceId: ref_id }
    // });
    //
    // 2. Update provider status + serial number
    // await prisma.transaction.update({
    //   where: { invoiceId: ref_id },
    //   data: {
    //     providerStatus: internalStatus.toLowerCase(),
    //     providerTrxId: trx_id,
    //     serialNumber: sn || undefined,
    //     completedAt: internalStatus === "SUCCESS" ? new Date() : undefined,
    //     updatedAt: new Date(),
    //   },
    // });
    //
    // 3. If FAILED → initiate refund or retry
    // if (internalStatus === "FAILED") {
    //   await handleTopupFailure(transaction);
    // }
    //
    // 4. Notify user
    // await sendNotification(transaction.userId, {
    //   title: internalStatus === "SUCCESS" ? "Topup Berhasil! 🎉" : "Topup Gagal",
    //   body: `${transaction.productName} - ${transaction.gameName}`,
    // });

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
