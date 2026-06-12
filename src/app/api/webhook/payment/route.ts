import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import {
  webhookLimiter,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import {
  verifyNotificationSignature,
  mapTransactionStatus,
  type MidtransNotification,
  type MidtransTransactionStatus,
} from "@/lib/services/midtrans";
import { processTopup, type TransactionRecord } from "@/lib/services/transaction";
import { prisma } from "@/lib/prisma";
import { eventBus } from "@/lib/services/event-bus";

/**
 * POST /api/webhook/payment
 *
 * Handle payment gateway callbacks from Midtrans.
 * Security:
 *  1. Rate limiting (100 req/min)
 *  2. Signature verification (SHA512)
 *  3. Idempotency check (by order_id + status)
 *
 * Flow:
 *  1. Verify signature
 *  2. Map Midtrans status → internal status
 *  3. Update DB transaction status
 *  4. If PAID → trigger processTopup() via Provider Router
 *  5. If topup succeeds → mark SUCCESS, fire TRANSACTION_COMPLETED
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIP(req);
    const rateResult = webhookLimiter.check(ip);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, webhookLimiter);
    }

    const body = (await req.json()) as MidtransNotification;

    // Validate required fields
    const { order_id, transaction_status, status_code, gross_amount, signature_key } = body;

    if (!order_id || !transaction_status) {
      return API_ERRORS.validation({
        order_id: !order_id ? ["order_id wajib"] : [],
        transaction_status: !transaction_status ? ["transaction_status wajib"] : [],
      });
    }

    // Verify signature (skip in dev if no server key configured)
    const isValidSignature = verifyNotificationSignature(body);
    if (!isValidSignature) {
      console.warn(`[Webhook] Invalid signature for order: ${order_id}`);
      return API_ERRORS.unauthorized();
    }

    // Map gateway status to internal status
    const internalStatus: MidtransTransactionStatus = mapTransactionStatus(
      transaction_status,
      body.fraud_status
    );

    // 1. Find transaction by order_id (invoiceId)
    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId: order_id },
      include: { payment: true },
    });

    if (!transaction) {
      console.warn(`[Webhook] Transaction not found: ${order_id}`);
      return API_ERRORS.notFound("Transaction not found");
    }

    // 2. Idempotency: skip if already at same or terminal status
    if (transaction.status === internalStatus) {
      return apiSuccess({ orderId: order_id, status: internalStatus, duplicate: true });
    }

    // 3. Update payment status in DB
    const updateData: Record<string, unknown> = {
      status: internalStatus,
      updatedAt: new Date(),
    };

    // Also update the Payment record
    if (transaction.payment) {
      await prisma.payment.update({
        where: { transactionId: transaction.id },
        data: {
          status: internalStatus === "PAID" || internalStatus === "SUCCESS" ? "PAID" 
                : internalStatus === "FAILED" || internalStatus === "EXPIRED" ? "FAILED" 
                : "PENDING",
          paidAt: internalStatus === "PAID" ? new Date() : undefined,
          callbackData: JSON.parse(JSON.stringify(body)),
          externalId: body.transaction_id,
        },
      });
    }

    // 4. If payment confirmed → trigger topup via Provider Router
    if (internalStatus === "PAID") {
      updateData.status = "PROCESSING";

      // Persist PROCESSING state first so user sees progress
      await prisma.transaction.update({
        where: { invoiceId: order_id },
        data: updateData,
      });

      console.log(`[Webhook] Payment confirmed for ${order_id}, triggering topup...`);

      // Build a TransactionRecord for processTopup
      const providerData = (transaction.providerData ?? {}) as Record<string, string>;
      const txRecord: TransactionRecord = {
        id: transaction.id,
        invoiceId: transaction.invoiceId,
        userId: transaction.userId,
        gameSlug: providerData.gameSlug || "",
        gameName: providerData.gameName || "",
        productCode: providerData.productCode || transaction.productItemId,
        productName: providerData.productName || "",
        gameUserId: transaction.gameUserId || "",
        gameZoneId: transaction.gameZoneId || undefined,
        price: transaction.price,
        fee: transaction.fee,
        discount: transaction.discount,
        total: transaction.total,
        paymentMethod: transaction.payment?.method || "",
        paymentStatus: "PAID",
        providerStatus: "processing",
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      };

      // Trigger topup asynchronously — don't block the webhook response
      processTopup(txRecord).then(async (topupResult) => {
        try {
          if (topupResult.success) {
            await prisma.transaction.update({
              where: { invoiceId: order_id },
              data: {
                status: "SUCCESS",
                providerRef: topupResult.providerTrxId,
                providerData: {
                  serialNumber: topupResult.serialNumber,
                  message: topupResult.message,
                },
                updatedAt: new Date(),
              },
            });

            // Fire completed event for background workers (XP, etc.)
            await eventBus.publish("TRANSACTION_COMPLETED", {
              transaction: { ...txRecord, providerStatus: "success" },
            });

            console.log(`[Webhook] Topup SUCCESS for ${order_id}: ${topupResult.message}`);
          } else {
            // Topup failed — mark as FAILED but payment was received (needs manual review / refund)
            await prisma.transaction.update({
              where: { invoiceId: order_id },
              data: {
                status: "FAILED",
                providerData: { error: topupResult.message, needsRefund: true },
                updatedAt: new Date(),
              },
            });
            console.error(`[Webhook] Topup FAILED for ${order_id}: ${topupResult.message}`);
          }
        } catch (err) {
          console.error(`[Webhook] Post-topup DB update failed for ${order_id}:`, err);
        }
      }).catch((err) => {
        console.error(`[Webhook] processTopup threw for ${order_id}:`, err);
      });

      // Return immediately — topup runs in background
      return apiSuccess(
        {
          orderId: order_id,
          status: "PROCESSING",
          processedAt: new Date().toISOString(),
        },
        {
          message: "Payment confirmed, topup in progress",
          headers: webhookLimiter.headers(rateResult),
        }
      );
    }

    // Non-PAID statuses: just update and return
    await prisma.transaction.update({
      where: { invoiceId: order_id },
      data: updateData,
    });

    // Fire update event for realtime listeners
    eventBus.emit("TRANSACTION_UPDATED", {
      invoiceId: order_id,
      status: internalStatus,
    });

    console.log(
      `[Webhook] Order: ${order_id}, Status: ${transaction_status} → ${internalStatus}, Amount: ${gross_amount}`
    );

    return apiSuccess(
      {
        orderId: order_id,
        status: internalStatus,
        processedAt: new Date().toISOString(),
      },
      {
        message: "Webhook processed successfully",
        headers: webhookLimiter.headers(rateResult),
      }
    );
  } catch {
    return API_ERRORS.internal();
  }
}
