import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTransaction } from "@/lib/services/transaction";
import { createDuitkuTransaction } from "@/lib/services/duitku";
import { z } from "zod";
import { logger } from "@/lib/telemetry";
import { transactionLimiter, getClientIP, rateLimitResponse } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { sendOrderCreatedEmail } from "@/lib/services/email";

const checkoutSchema = z.object({
  gameSlug: z.string().min(1).max(100),
  gameName: z.string().min(1).max(200),
  productCode: z.string().min(1).max(100),
  productName: z.string().min(1).max(200),
  // User-supplied account IDs: trim + strict length cap to prevent injection
  gameUserId: z.string().min(1).max(64).transform((s) => s.trim()),
  gameZoneId: z.string().max(64).transform((s) => s.trim()).optional(),
  price: z.number().positive().max(10_000_000), // cap at 10M IDR
  paymentMethod: z.string().min(1).max(50),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Require authentication — no guest checkout
    if (!session?.user?.id) {
      return API_ERRORS.unauthorized();
    }
    
    // Rate Limiting
    const rateLimitKey = session.user.id || getClientIP(req);
    const rlResult = await transactionLimiter.check(rateLimitKey);
    if (!rlResult.allowed) {
      return rateLimitResponse(rlResult, transactionLimiter);
    }

    const userId = session.user.id;
    const customerName = session.user.name || "User";
    const customerEmail = session.user.email || "";

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return API_ERRORS.validation(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
            k,
            v ?? [],
          ])
        )
      );
    }

    // Velocity Rule: Fraud Prevention
    // Block if user has >= 3 FAILED transactions in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentFailures = await prisma.transaction.count({
      where: {
        userId,
        status: "FAILED",
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentFailures >= 3) {
      logger.warn("Velocity rule triggered: Blocked checkout", { userId, failures: recentFailures });
      return apiError("Terlalu banyak transaksi gagal. Harap tunggu 1 jam.", { status: 429 });
    }

    // Price-drift protection: verify submitted price against live DB price
    // Scenario: Admin raises price between user opening page and submitting checkout.
    // Without this check, user gets billed the OLD price (revenue loss) or the
    // system creates a transaction that mismatches what iPaymu will charge.
    const liveItem = await prisma.productItem.findFirst({
      where: { 
        product: { slug: parsed.data.gameSlug },
        name: { equals: parsed.data.productName, mode: "insensitive" },
        isActive: true,
      },
      select: { price: true, name: true },
    });
    if (liveItem && Math.abs(liveItem.price - parsed.data.price) > 1) {
      logger.warn("Price mismatch at checkout", {
        submitted: parsed.data.price,
        live: liveItem.price,
        userId,
        gameSlug: parsed.data.gameSlug,
      });
      return apiError(
        `Harga produk telah berubah. Harga terbaru: Rp${liveItem.price.toLocaleString("id-ID")}. Silakan coba kembali.`,
        { status: 409 }
      );
    }

    // Pending invoice flood detection: block fraudsters generating hundreds of
    // unpaid Snap tokens (API quota drain and storage abuse)
    const recentPending = await prisma.transaction.count({
      where: { userId, status: "PENDING", createdAt: { gte: oneHourAgo } },
    });
    if (recentPending >= 5) {
      logger.warn("Pending invoice flood detected", { userId, pendingCount: recentPending });
      return apiError("Terlalu banyak pesanan tertunda. Selesaikan atau batalkan pesanan sebelumnya.", { status: 429 });
    }

    // 1. Create Internal Transaction (DB)
    const transaction = await createTransaction({
      ...parsed.data,
      userId,
      customerName,
      customerEmail,
    });

    // 2. Generate Duitku Payment Link
    const duitkuResponse = await createDuitkuTransaction({
      merchantOrderId: transaction.invoiceId,
      paymentAmount: transaction.total,
      productDetails: `Pembayaran ${parsed.data.gameName} - ${parsed.data.productName}`,
      email: customerEmail || "no-email@miqstore.online",
      customerVaName: customerName,
      paymentMethod: parsed.data.paymentMethod,
      itemDetails: [
        {
          name: `${parsed.data.gameName} - ${parsed.data.productName}`,
          price: transaction.total,
          quantity: 1,
        }
      ],
      customerDetail: {
        firstName: customerName,
        lastName: "",
        email: customerEmail || "no-email@miqstore.online",
      }
    });

    if (!duitkuResponse.success) {
      throw new Error(duitkuResponse.message || "Gagal membuat sesi pembayaran Duitku");
    }

    // 3. Send Email Notification (non-blocking)
    if (customerEmail) {
      sendOrderCreatedEmail({
        to: customerEmail,
        customerName,
        invoiceId: transaction.invoiceId,
        gameName: parsed.data.gameName,
        productName: parsed.data.productName,
        price: transaction.total,
      }).catch(e => logger.error("Async email error", e));
    }

    // 4. Return Payment Link to Frontend
    return apiSuccess({
      invoiceId: transaction.invoiceId,
      token: duitkuResponse.reference,
      redirectUrl: duitkuResponse.paymentUrl
    }, {
      message: "Transaksi berhasil dibuat",
      status: 201,
      headers: transactionLimiter.headers(rlResult),
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memproses checkout";
    logger.error("Checkout API Error", { 
        message, 
        error: error instanceof Error ? error.stack : error 
    });
    return apiError(message, { status: 500 });
  }
}
