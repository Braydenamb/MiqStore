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
} from "@/lib/services/midtrans";
import { prisma } from "@/lib/prisma";
import { eventBus } from "@/lib/services/event-bus";

/**
 * POST /api/webhook/payment
 *
 * Handle payment gateway callbacks from Midtrans.
 * Security:
 *  1. Rate limiting (100 req/min)
 *  2. Signature verification (SHA512)
 *  3. Idempotency check (by order_id)
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
    const internalStatus = mapTransactionStatus(
      transaction_status,
      body.fraud_status
    );

    // 1. Find transaction by order_id (invoiceId)
    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId: order_id }
    });

    if (!transaction) {
      console.warn(`[Webhook] Transaction not found: ${order_id}`);
      return API_ERRORS.notFound("Transaction not found");
    }

    // 2. Check idempotency (skip if already processed to same status)
    if (transaction.status === internalStatus) {
      return apiSuccess({ orderId: order_id, status: internalStatus, duplicate: true });
    }

    // 3. Update payment status
    await prisma.transaction.update({
      where: { invoiceId: order_id },
      data: {
        status: internalStatus,
        updatedAt: new Date(),
      },
    });

    // 4. Fire Event for realtime updates
    eventBus.emit("TRANSACTION_UPDATED", {
       invoiceId: order_id,
       status: internalStatus
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
