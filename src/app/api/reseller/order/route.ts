import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { validateApiKey, logApiRequest } from "@/lib/services/reseller";
import { handleWalletCheckout } from "@/lib/services/transaction";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let apiKeyId = "unknown";
  let requestPayload: Record<string, unknown> = {};

  try {
    // 1. Auth Validation
    const rawKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const authResult = await validateApiKey(rawKey);

    if (!authResult.isValid || !authResult.userId) {
      return API_ERRORS.unauthorized();
    }

    apiKeyId = authResult.apiKeyId!;

    // 2. Parse Request
    try {
      requestPayload = await req.json();
    } catch {
      return API_ERRORS.validation({ body: ["Invalid JSON payload"] });
    }

    const { gameSlug, productCode, gameUserId, gameZoneId, callbackUrl } = requestPayload as Record<string, string>;

    if (!gameSlug || !productCode || !gameUserId) {
      return API_ERRORS.validation({ fields: ["gameSlug, productCode, and gameUserId are required"] });
    }

    // 3. Process B2B Order (Using Wallet Checkout Flow)
    // In production, we'd lookup the actual product from the DB to get the `resellerPrice`
    // For this demonstration, we'll mock the lookup and assume a flat price of 10,000 IDR
    const transaction = await handleWalletCheckout({
      userId: authResult.userId,
      gameSlug,
      gameName: "Mock Game", // Should come from DB
      productCode,
      productName: "Mock Product", // Should come from DB
      gameUserId,
      gameZoneId,
      price: 10000, // Should come from ProductItem.resellerPrice
      paymentMethod: "WALLET",
      customerName: "B2B Reseller",
      customerEmail: "b2b@example.com"
    });

    // 4. Return Response
    const responseData = {
      invoiceId: transaction.invoiceId,
      status: transaction.providerStatus,
      gameUserId,
      productCode,
      price: transaction.total,
      message: "Order placed successfully via API",
    };

    await logApiRequest({
      apiKeyId,
      endpoint: "/api/reseller/order",
      method: "POST",
      status: 200,
      requestPayload,
      responsePayload: responseData,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "unknown",
      durationMs: Date.now() - startTime,
    });

    // FUTURE: If callbackUrl exists, add it to a Redis Queue to fire asynchronously when Apigames finishes

    return apiSuccess(responseData);

  } catch (error: unknown) {
    console.error("Reseller API Order Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    const status = errorMessage.includes("Insufficient") ? 402 : 500;

    await logApiRequest({
      apiKeyId,
      endpoint: "/api/reseller/order",
      method: "POST",
      status,
      requestPayload,
      responsePayload: { error: errorMessage },
      durationMs: Date.now() - startTime,
    });

    if (status === 402) return API_ERRORS.validation({ balance: [errorMessage] });
    return API_ERRORS.internal(errorMessage);
  }
}
