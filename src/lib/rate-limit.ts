/**
 * Rate Limiter
 *
 * Redis-backed sliding window rate limiter for API routes.
 * Falls back to in-memory when Redis is unavailable.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60_000, max: 30 });
 *   const result = await limiter.check(ip);
 *   if (!result.allowed) return rateLimitResponse(result, limiter);
 */

import { redis } from "./redis";
import { logger } from "./telemetry";

interface RateLimiterConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Max requests per window */
  max: number;
  /** Custom key prefix for namespacing */
  prefix?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs: number;
}

// ── In-memory fallback store (for when Redis is down) ────────────────────────
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStores = new Map<string, Map<string, RateLimitEntry>>();

/** Cleanup stale entries every 5 minutes */
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [, store] of memoryStores) {
      for (const [key, entry] of store) {
        if (entry.resetAt < now) {
          store.delete(key);
        }
      }
    }
  }, 5 * 60 * 1000);
}

function memoryCheck(
  store: Map<string, RateLimitEntry>,
  key: string,
  windowMs: number,
  max: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs, retryAfterMs: 0 };
  }

  entry.count++;

  if (entry.count > max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt, retryAfterMs: entry.resetAt - now };
  }

  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt, retryAfterMs: 0 };
}

// ── Redis-backed rate limiter ────────────────────────────────────────────────

export function createRateLimiter(config: RateLimiterConfig) {
  const { windowMs, max, prefix = "default" } = config;

  if (!memoryStores.has(prefix)) {
    memoryStores.set(prefix, new Map());
  }
  const memoryStore = memoryStores.get(prefix)!;
  startCleanup();

  return {
    async check(key: string): Promise<RateLimitResult> {
      const redisKey = `rl:${prefix}:${key}`;
      const windowSec = Math.ceil(windowMs / 1000);

      try {
        // Atomic INCR + EXPIRE via Redis pipeline
        const pipeline = redis.pipeline();
        pipeline.incr(redisKey);
        pipeline.pttl(redisKey);
        const results = await pipeline.exec();

        if (!results) {
          throw new Error("Redis pipeline returned null");
        }

        const count = (results[0]?.[1] as number) ?? 1;
        let ttl = (results[1]?.[1] as number) ?? -1;

        // First request in window: set expiry
        if (ttl === -1 || count === 1) {
          await redis.pexpire(redisKey, windowMs);
          ttl = windowMs;
        }

        const resetAt = Date.now() + (ttl > 0 ? ttl : windowMs);

        if (count > max) {
          return {
            allowed: false,
            remaining: 0,
            resetAt,
            retryAfterMs: ttl > 0 ? ttl : windowMs,
          };
        }

        return {
          allowed: true,
          remaining: max - count,
          resetAt,
          retryAfterMs: 0,
        };
      } catch {
        // Redis unavailable — fall back to in-memory
        logger.warn("Rate limiter falling back to in-memory", { prefix, key });
        return memoryCheck(memoryStore, key, windowMs, max);
      }
    },

    /** Get rate limit headers for response */
    headers(result: RateLimitResult): Record<string, string> {
      return {
        "X-RateLimit-Limit": String(max),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        ...(result.retryAfterMs > 0
          ? { "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)) }
          : {}),
      };
    },

    /** Reset a specific key (for testing) */
    async reset(key: string) {
      const redisKey = `rl:${prefix}:${key}`;
      try {
        await redis.del(redisKey);
      } catch {
        // Ignore Redis errors during reset
      }
      memoryStore.delete(key);
    },
  };
}

/* ─── Pre-configured Limiters ─── */

/** General API: 60 req/min */
export const apiLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 60,
  prefix: "api",
});

/** Auth endpoints: 10 req/min (prevent brute force) */
export const authLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 10,
  prefix: "auth",
});

/** Webhook endpoints: 100 req/min (high throughput from gateways) */
export const webhookLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 100,
  prefix: "webhook",
});

/** Transaction creation: 5 req/min per user */
export const transactionLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 5,
  prefix: "transaction",
});

/* ─── Helper: Extract IP from request ─── */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

/* ─── Helper: Create rate limit error response ─── */
export function rateLimitResponse(
  result: RateLimitResult,
  limiter: ReturnType<typeof createRateLimiter>
): Response {
  return Response.json(
    {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Terlalu banyak request. Coba lagi nanti.",
        retryAfterSeconds: Math.ceil(result.retryAfterMs / 1000),
      },
    },
    {
      status: 429,
      headers: limiter.headers(result),
    }
  );
}
