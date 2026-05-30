import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { getCurrentUser, isAdmin } from "@/lib/auth";

/**
 * POST /api/webhook/payment
 * Handle payment gateway callbacks (Midtrans/Xendit/Tripay).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify webhook signature (in production)
    // const signature = req.headers.get("x-callback-signature");
    // if (!verifySignature(signature, body)) return API_ERRORS.unauthorized();

    const { order_id, transaction_status, payment_type, gross_amount } = body;

    if (!order_id || !transaction_status) {
      return API_ERRORS.validation({
        order_id: !order_id ? ["order_id wajib"] : [],
        transaction_status: !transaction_status ? ["transaction_status wajib"] : [],
      });
    }

    // Map gateway status to our status
    const statusMap: Record<string, string> = {
      capture: "PAID",
      settlement: "PAID",
      pending: "PENDING",
      deny: "FAILED",
      cancel: "FAILED",
      expire: "EXPIRED",
      refund: "REFUNDED",
    };

    const internalStatus = statusMap[transaction_status] || "PENDING";

    // In production:
    // 1. Find transaction by order_id (invoiceId)
    // 2. Update payment status
    // 3. If PAID → trigger topup via provider API
    // 4. Send notification to user
    // 5. Update wallet balance if using saldo

    console.log(
      `[Webhook] Order: ${order_id}, Status: ${transaction_status} → ${internalStatus}, Amount: ${gross_amount}, Method: ${payment_type}`
    );

    return apiSuccess(
      {
        orderId: order_id,
        status: internalStatus,
        processedAt: new Date().toISOString(),
      },
      { message: "Webhook processed successfully" }
    );
  } catch {
    return API_ERRORS.internal();
  }
}
