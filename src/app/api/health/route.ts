import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health
 *
 * Lightweight health check endpoint for container orchestrators.
 * Verifies DB connectivity and returns service status.
 */
export async function GET() {
  const checks: Record<string, string> = {
    app: "ok",
    db: "unknown",
  };

  try {
    // Quick DB connectivity check — count is cheaper than a full query
    await prisma.$queryRaw`SELECT 1`;
    checks.db = "ok";
  } catch {
    checks.db = "error";
  }

  const isHealthy = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: isHealthy ? 200 : 503 }
  );
}
