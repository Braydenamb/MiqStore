import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { validateApiKey, logApiRequest } from "@/lib/services/reseller";
import { getWalletBalance } from "@/lib/services/wallet";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let apiKeyId = "unknown";

  try {
    // 1. Auth Validation
    const rawKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const authResult = await validateApiKey(rawKey);

    if (!authResult.isValid || !authResult.userId) {
      return API_ERRORS.unauthorized();
    }

    apiKeyId = authResult.apiKeyId!;

    // 2. Fetch Balance
    const balance = await getWalletBalance(authResult.userId);

    // 3. Return & Log
    const responseData = { balance, currency: "IDR" };
    
    await logApiRequest({
      apiKeyId,
      endpoint: "/api/reseller/balance",
      method: "GET",
      status: 200,
      responsePayload: responseData,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "unknown",
      durationMs: Date.now() - startTime,
    });

    return apiSuccess(responseData);
  } catch (error) {
    console.error("Reseller API Balance Error:", error);
    
    await logApiRequest({
      apiKeyId,
      endpoint: "/api/reseller/balance",
      method: "GET",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs: Date.now() - startTime,
    });

    return API_ERRORS.internal("Internal Server Error");
  }
}
