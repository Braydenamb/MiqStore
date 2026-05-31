import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. In production: Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) return API_ERRORS.unauthorized();
    const userId = session.user.id;

    // 2. Fetch history
    const history = await prisma.balanceHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return apiSuccess({ history });
  } catch (error) {
    console.error("Wallet History Error:", error);
    return API_ERRORS.internal("Failed to fetch wallet history");
  }
}
