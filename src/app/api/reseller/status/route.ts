import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { validateApiKey, logApiRequest } from "@/lib/services/reseller";

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

    // 2. Parse Query
    const invoiceId = req.nextUrl.searchParams.get("invoiceId");
    if (!invoiceId) {
      return API_ERRORS.validation({ invoiceId: ["invoiceId is required"] });
    }

    // 3. Fetch Transaction (Mocked for now)
    // In production: const tx = await prisma.transaction.findUnique({ where: { invoiceId, userId: authResult.userId } });
    
    // Simulating a DB lookup
    const responseData = {
      invoiceId,
      status: "success", // MOCKED
      providerTrxId: "AG-123456",
      serialNumber: "SN123456789",
      updatedAt: new Date().toISOString()
    };

    // 4. Log and Return
    await logApiRequest({
      apiKeyId,
      endpoint: "/api/reseller/status",
      method: "GET",
      status: 200,
      responsePayload: responseData,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "unknown",
      durationMs: Date.now() - startTime,
    });

    return apiSuccess(responseData);

  } catch (error) {
    console.error("Reseller API Status Error:", error);
    
    await logApiRequest({
      apiKeyId,
      endpoint: "/api/reseller/status",
      method: "GET",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs: Date.now() - startTime,
    } as any);

    return API_ERRORS.internal("Internal Server Error");
  }
}
