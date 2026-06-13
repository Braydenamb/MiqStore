import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTransaction } from "@/lib/services/transaction";
import { createSnapTransaction } from "@/lib/services/midtrans";
import { z } from "zod";
import { logger } from "@/lib/telemetry";

const checkoutSchema = z.object({
  gameSlug: z.string().min(1),
  gameName: z.string().min(1),
  productCode: z.string().min(1),
  productName: z.string().min(1),
  gameUserId: z.string().min(1),
  gameZoneId: z.string().optional(),
  price: z.number().positive(),
  paymentMethod: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Require authentication — no guest checkout
    if (!session?.user?.id) {
      return API_ERRORS.unauthorized();
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

    // 1. Create Internal Transaction (DB)
    const transaction = await createTransaction({
      ...parsed.data,
      userId,
      customerName,
      customerEmail,
    });

    // 2. Generate Midtrans Snap Token
    const snapResponse = await createSnapTransaction({
      orderId: transaction.invoiceId,
      amount: transaction.total,
      customerName: customerName,
      customerEmail: customerEmail,
      itemName: `${parsed.data.gameName} - ${parsed.data.productName}`,
      itemCategory: "Digital Goods",
      itemQuantity: 1,
      paymentMethod: parsed.data.paymentMethod,
    });

    // 3. Return Snap Token to Frontend
    return apiSuccess({
      invoiceId: transaction.invoiceId,
      token: snapResponse.token,
      redirectUrl: snapResponse.redirectUrl
    }, {
      message: "Transaksi berhasil dibuat",
      status: 201,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memproses checkout";
    logger.error("Checkout API Error:", message);
    return apiError(message, { status: 500 });
  }
}
