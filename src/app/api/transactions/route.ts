import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { createTransactionSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateFee, calculateDiscount } from "@/lib/services/transaction";
import { generateInvoiceId } from "@/lib/utils";
import { createSnapTransaction } from "@/lib/services/midtrans";

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

    // Look up the product item to get real price and product context
    const item = await prisma.productItem.findUnique({
      where: { id: productItemId, isActive: true },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!item) {
      return API_ERRORS.notFound("Product item");
    }

    const invoiceId = generateInvoiceId();
    const price = item.price;
    const fee = calculateFee(price, paymentMethod);
    const discount = calculateDiscount(price, promoCode);
    const total = price + fee - discount;

    // Create the transaction in DB
    const transaction = await prisma.transaction.create({
      data: {
        invoiceId,
        userId: user.id,
        productId: item.product.id,
        productItemId: item.id,
        price,
        fee,
        discount,
        total,
        status: "PENDING",
        gameUserId: gameUserId || null,
        gameZoneId: gameZoneId || null,
        providerData: {
          gameSlug: item.product.slug,
          gameName: item.product.name,
          productName: item.name,
        },
        payment: {
          create: {
            gateway: "midtrans",
            method: paymentMethod,
            amount: total,
            status: "PENDING",
          },
        },
      },
      include: { payment: true },
    });

    // Generate Midtrans Snap token
    const snapResult = await createSnapTransaction({
      orderId: invoiceId,
      amount: total,
      customerName: user.name || "User",
      customerEmail: user.email || "",
      itemName: `${item.product.name} - ${item.name}`,
      itemCategory: "Digital Goods",
      paymentMethod,
    });

    return apiSuccess({
      id: transaction.id,
      invoiceId,
      total,
      fee,
      discount,
      snapToken: snapResult.token,
      redirectUrl: snapResult.redirectUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }, {
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
      ...(status ? { status: status as "PENDING" | "PAID" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED" | "EXPIRED" } : {}),
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
