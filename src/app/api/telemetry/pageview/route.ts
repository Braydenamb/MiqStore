import { NextRequest, NextResponse } from "next/server";
import { logger, metrics } from "@/lib/telemetry";
import { getClientIP } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = body.path || "unknown";
    
    // Anonymize IP to create a daily unique session hash without storing PII
    const rawIp = getClientIP(req);
    const dateSalt = new Date().toISOString().split("T")[0]; 
    const sessionHash = crypto.createHash("sha256").update(`${rawIp}-${dateSalt}`).digest("hex").slice(0, 16);

    logger.info("pageview", { path, session: sessionHash });
    metrics.increment(`pageview:${path}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
