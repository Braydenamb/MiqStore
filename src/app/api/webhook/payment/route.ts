import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { logger } from "@/lib/telemetry";
import { sendOrderSuccessEmail, sendOrderFailedEmail } from "@/lib/services/email";
import { routeTopupOrder } from "@/lib/services/provider-router";
import {
  type DuitkuNotification,
  type DuitkuTransactionStatus,
  mapTransactionStatus,
  generateCallbackSignature
} from "@/lib/services/duitku";

/**
 * Handle payment gateway callbacks from Duitku.
 *
 * Flow:
 *  1. Receive webhook POST (x-www-form-urlencoded)
 *  2. Validate Signature
 *  3. Map Duitku resultCode → internal status
 *  4. Idempotency Check (Has this transaction already been processed?)
 *  5. Database Transaction (OCC)
 *  6. If PAID, trigger Provider fulfillment
 *  7. Return 200 OK
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: Partial<DuitkuNotification>;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData) as Partial<DuitkuNotification>;
    } else {
      body = (await req.json()) as Partial<DuitkuNotification>;
    }

    const { merchantCode, amount, merchantOrderId, signature, resultCode, reference } = body;

    if (!merchantCode || !amount || !merchantOrderId || !signature) {
      return apiError("Missing required parameters", { status: 400 });
    }

    // Validate Duitku Signature
    const expectedSignature = generateCallbackSignature(amount, merchantOrderId);
    if (signature !== expectedSignature) {
      logger.error("Invalid Duitku Signature", { merchantOrderId, signature, expectedSignature });
      return apiError("Bad Signature", { status: 401 });
    }

    const order_id = merchantOrderId;

    logger.info("Duitku Webhook Received", { order_id, resultCode, reference });

    // Find the transaction in our DB
    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId: order_id },
      include: {
        product: true,
        productItem: true,
        user: true,
      },
    });

    if (!transaction) {
      logger.error("Transaction not found for webhook", { order_id });
      return apiError("Transaction not found", { status: 404 });
    }

    const internalStatus: DuitkuTransactionStatus = mapTransactionStatus(resultCode || "");

    // ------------------------------------------------------------------
    // Phase 1: Idempotency & OCC Claim
    // ------------------------------------------------------------------
    if (transaction.status === "SUCCESS" || transaction.status === "FAILED" || transaction.status === "REFUNDED") {
      logger.info("Webhook ignored: Transaction already in terminal state", { order_id, status: transaction.status });
      return apiSuccess({ status: "IGNORED" });
    }

    // Only process state changes
    if (transaction.status === internalStatus) {
      return apiSuccess({ status: "NO_CHANGE" });
    }

    // Attempt to claim the transaction for processing
    const claimResult = await prisma.transaction.updateMany({
      where: { invoiceId: order_id, status: transaction.status },
      data: { status: internalStatus, updatedAt: new Date() },
    });

    if (claimResult.count === 0) {
      logger.warn("Race condition prevented: Webhook claim failed", { order_id });
      return apiSuccess({ status: "RACE_CONDITION_PREVENTED", duplicate: true });
    }

    // Send Failed Email
    if (internalStatus === "FAILED" || internalStatus === "EXPIRED") {
      if (transaction.user?.email) {
        sendOrderFailedEmail({
          to: transaction.user.email,
          customerName: transaction.user.name || "User",
          invoiceId: transaction.invoiceId,
          gameName: (transaction as any).product?.name || "Game",
          productName: (transaction as any).productItem?.name || "Item",
          price: transaction.total,
        }).catch(e => logger.error("Async email error", e));
      }
    }

    // ------------------------------------------------------------------
    // Phase 2: Fulfillment (If Paid)
    // ------------------------------------------------------------------
    if (internalStatus === "PAID") {
      try {
        // Log payment metadata
        await prisma.payment.updateMany({
          where: { transactionId: transaction.id },
          data: {
            status: "PAID",
            updatedAt: new Date(),
          },
        });

        // Trigger Provider
        // routeTopupOrder(productCode, gameUserId, zoneId, invoiceId)
        const topupResult = await routeTopupOrder(
          (transaction as any).productItem?.providerCode || "",
          transaction.gameUserId || "",
          transaction.gameZoneId || undefined,
          transaction.invoiceId
        );

        if (topupResult.success) {
          // Topup Success
          await prisma.transaction.update({
            where: { invoiceId: order_id },
            data: {
              status: "SUCCESS",
              providerData: { sn: topupResult.serialNumber, trxId: topupResult.providerTrxId } as any,
              updatedAt: new Date(),
            },
          });
          logger.info("Fulfillment successful via webhook", { order_id, sn: topupResult.serialNumber });
          if (transaction.user?.email) {
            sendOrderSuccessEmail({
              to: transaction.user.email,
              customerName: transaction.user.name || "User",
              invoiceId: transaction.invoiceId,
              gameName: (transaction as any).product?.name || "Game",
              productName: (transaction as any).productItem?.name || "Item",
              price: transaction.total,
            }).catch(e => logger.error("Async email error", e));
          }
        } else {
          // Topup Failed
          logger.error("Fulfillment failed via webhook", { order_id, reason: topupResult.message });
          
          let refundStatus = "pending_manual_refund";
          
          // Claim lock before refunding
          const claimLock = await prisma.transaction.updateMany({
            where: { invoiceId: order_id, status: "PAID" },
            data: { status: "FAILED" }
          });
          
          if (claimLock.count === 0) {
             logger.warn("Refund aborted: async webhook already processed this transaction", { orderId: order_id });
             return apiSuccess({ status: "RACE_CONDITION_PREVENTED", duplicate: true });
          }

          await prisma.transaction.updateMany({
            // Status is now FAILED due to the claim lock
            where: { invoiceId: order_id, status: "FAILED" },
            data: {
              status: "FAILED",
              providerData: { error: topupResult.message, needsRefund: true, refundStatus } as any,
              updatedAt: new Date(),
            },
          });
        }
      } catch (err) {
        logger.error("Unhandled exception during webhook fulfillment", {
          order_id,
          error: String(err),
        });
        
        // Failsafe: Ensure it doesn't get stuck in PAID without fulfillment
        await prisma.transaction.updateMany({
            where: { invoiceId: order_id, status: "PAID" },
            data: {
                status: "FAILED",
                providerData: { error: "Unhandled Exception", needsRefund: true } as any,
                updatedAt: new Date()
            }
        });
      }
    }

    return apiSuccess({ status: "PROCESSED", internalStatus });
  } catch (error) {
    logger.error("Webhook exception", { error: String(error) });
    return apiError("Internal server error", { status: 500 });
  }
}
