import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/invoice/[id]
 *
 * Fetch transaction details by invoiceId for the invoice/status page.
 * Returns full order context including game name, product name,
 * payment info, and current status from the DB.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;

    if (!invoiceId) {
      return API_ERRORS.validation({ id: ["Invoice ID is required"] });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId },
      include: {
        payment: true,
        product: { select: { name: true, slug: true, image: true } },
        productItem: { select: { name: true, amount: true } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!transaction) {
      return API_ERRORS.notFound("Invoice");
    }

    // Extract display names from providerData (stored at creation time)
    const providerData = (transaction.providerData ?? {}) as Record<string, string>;
    const gameName = providerData.gameName || transaction.product?.name || "Game";
    const productName = providerData.productName || transaction.productItem?.name || "Product";
    const gameSlug = providerData.gameSlug || transaction.product?.slug || "";

    // Map internal status to invoice display status
    const statusMap: Record<string, string> = {
      PENDING: "pending",
      PAID: "paid",
      PROCESSING: "processing",
      SUCCESS: "success",
      FAILED: "failed",
      EXPIRED: "expired",
      REFUNDED: "refunded",
    };

    const displayStatus = statusMap[transaction.status] || "pending";

    return apiSuccess({
      id: transaction.invoiceId,
      game: gameName,
      gameSlug,
      product: productName,
      gameUserId: transaction.gameUserId || "",
      gameZoneId: transaction.gameZoneId || "",
      price: transaction.price,
      fee: transaction.fee,
      discount: transaction.discount,
      total: transaction.total,
      payment: transaction.payment?.method || "Unknown",
      paymentGateway: transaction.payment?.gateway || "midtrans",
      status: displayStatus,
      providerRef: transaction.providerRef,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      // Expiry: 24h from creation (matches Midtrans expiry config)
      expiredAt: new Date(transaction.createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch {
    return API_ERRORS.internal("Failed to fetch invoice");
  }
}
