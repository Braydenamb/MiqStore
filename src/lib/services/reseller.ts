import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Reseller B2B API Service
 */

export interface ApiValidationResult {
  isValid: boolean;
  userId?: string;
  apiKeyId?: string;
  error?: string;
}

/**
 * Generate a new API Key for a reseller.
 * Returns the raw key ONLY ONCE. The DB stores a SHA-256 hash.
 */
export async function generateApiKey(userId: string, name: string) {
  // Generate 32 bytes of secure random data
  const rawKey = `miq_${crypto.randomBytes(32).toString("hex")}`;
  
  // Hash the key for storage
  const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");

  // In production:
  // const apiKey = await prisma.apiKey.create({
  //   data: {
  //     userId,
  //     name,
  //     key: hashedKey,
  //   }
  // });

  return {
    rawKey,
    id: "mock_api_key_id",
  };
}

/**
 * Validates an incoming API key from the Authorization or X-API-KEY header.
 * Hashes the incoming key and looks for a match.
 */
export async function validateApiKey(rawKey: string): Promise<ApiValidationResult> {
  if (!rawKey || !rawKey.startsWith("miq_")) {
    return { isValid: false, error: "Invalid API Key format" };
  }

  const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");

  // In production:
  // const apiKey = await prisma.apiKey.findUnique({ where: { key: hashedKey } });
  // if (!apiKey || !apiKey.isActive) return { isValid: false, error: "API Key inactive or invalid" };
  // 
  // // Update last used time asynchronously
  // prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(console.error);
  //
  // return { isValid: true, userId: apiKey.userId, apiKeyId: apiKey.id };

  // MOCK VALIDATION FOR NOW: Assume any key starting with "miq_valid_" is good.
  if (rawKey.startsWith("miq_valid_")) {
    return { isValid: true, userId: "123456789", apiKeyId: "mock_api_key_id" };
  }

  return { isValid: false, error: "Invalid API Key" };
}

/**
 * Logs an API request to the ApiLog table for analytics and rate limiting.
 */
export async function logApiRequest(data: {
  apiKeyId: string;
  endpoint: string;
  method: string;
  status: number;
  requestPayload?: any;
  responsePayload?: any;
  ip?: string;
  userAgent?: string;
  durationMs: number;
}) {
  // In production:
  // await prisma.apiLog.create({
  //   data: {
  //     apiKeyId: data.apiKeyId,
  //     endpoint: data.endpoint,
  //     method: data.method,
  //     status: data.status,
  //     request: data.requestPayload ? JSON.parse(JSON.stringify(data.requestPayload)) : null,
  //     response: data.responsePayload ? JSON.parse(JSON.stringify(data.responsePayload)) : null,
  //     ip: data.ip,
  //     userAgent: data.userAgent,
  //     duration: data.durationMs,
  //   }
  // });

  console.log(`[API Log] ${data.method} ${data.endpoint} - ${data.status} (${data.durationMs}ms)`);
}
