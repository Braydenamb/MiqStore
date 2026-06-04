import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { createTransactionSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/transactions
 * Create a new transaction (purchase/topup).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) return API_ERRORS.unauthorized();

    const body = await req.json();
    const parsed = createTransactionSchema.safeParse(body);

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

    const { productItemId, paymentMethod, gameUserId, gameZoneId, promoCode } =
      parsed.data;

    // Mock: generate invoice
    const invoiceId = `INV-${Date.now().toString(36).toUpperCase()}`;
    const mockPrice = 68000;
    const fee = paymentMethod === "qris" ? Math.round(mockPrice * 0.007) : 4000;
    const discount = promoCode ? Math.round(mockPrice * 0.1) : 0;
    const total = mockPrice + fee - discount;

    const transaction = {
      id: crypto.randomUUID(),
      invoiceId,
      userId: user.id,
      productItemId,
      price: mockPrice,
      fee,
      discount,
      total,
      status: "PENDING",
      gameUserId: gameUserId || null,
      gameZoneId: gameZoneId || null,
      paymentMethod,
      paymentUrl: null,
      paymentCode: paymentMethod.includes("va")
        ? `8808${Math.random().toString().slice(2, 14)}`
        : null,
      qrUrl:
        paymentMethod === "qris"
          ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${invoiceId}`
          : null,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(transaction, {
      message: "Transaksi berhasil dibuat. Silakan selesaikan pembayaran.",
      status: 201,
    });
  } catch {
    return API_ERRORS.internal();
  }
}

/**
 * GET /api/transactions
 * List user's transactions.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) return API_ERRORS.unauthorized();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "10");
    const status = searchParams.get("status")?.toUpperCase();

    const where = {
      userId: user.id,
      ...(status ? { status: status as any } : {}),
    };

    const total = await prisma.transaction.count({ where });
    const totalPages = Math.ceil(total / perPage);

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        product: { select: { name: true } },
        productItem: { select: { name: true } },
        payment: { select: { method: true } },
      },
    });

    const formattedTransactions = transactions.map((tx) => ({
      id: tx.id,
      invoiceId: tx.invoiceId,
      game: tx.product?.name || "Unknown Game",
      product: tx.productItem?.name || "Unknown Product",
      price: tx.price,
      total: tx.total,
      status: tx.status,
      paymentMethod: tx.payment?.method || "Unknown",
      createdAt: tx.createdAt.toISOString(),
    }));

    return apiSuccess(formattedTransactions, {
      meta: { page, perPage, total, totalPages },
    });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return API_ERRORS.internal();
  }
}
