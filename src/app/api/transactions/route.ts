import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { createTransactionSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";

/**
 * POST /api/transactions
 * Create a new transaction (purchase/topup).
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
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
    const user = await getCurrentUser();
    if (!user) return API_ERRORS.unauthorized();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "10");
    const status = searchParams.get("status");

    // Mock transactions
    const allTransactions = Array.from({ length: 25 }, (_, i) => ({
      id: `tx_${i + 1}`,
      invoiceId: `INV-${(1000 + i).toString()}`,
      game: ["Mobile Legends", "Free Fire", "Genshin Impact", "Valorant", "PUBG Mobile"][i % 5],
      product: ["344 Diamonds", "355 Diamonds", "Welkin Moon", "700 VP", "325 UC"][i % 5],
      price: [68000, 65000, 79000, 79000, 55000][i % 5],
      total: [72000, 69000, 83000, 83000, 59000][i % 5],
      status: (["SUCCESS", "SUCCESS", "SUCCESS", "PROCESSING", "FAILED"] as const)[i % 5],
      paymentMethod: ["QRIS", "GoPay", "BCA VA", "DANA", "OVO"][i % 5],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));

    let filtered = allTransactions;
    if (status) {
      filtered = filtered.filter((t) => t.status === status.toUpperCase());
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return apiSuccess(paginated, {
      meta: { page, perPage, total, totalPages },
    });
  } catch {
    return API_ERRORS.internal();
  }
}
