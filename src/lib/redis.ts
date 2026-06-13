import Redis from "ioredis";
import { logger } from "./telemetry";

/**
 * Redis client singleton.
 * Uses REDIS_URL env var. Falls back to localhost:6379 for local dev.
 *
 * In production: Upstash Redis via REDIS_URL.
 * In development: Docker Redis via docker-compose.
 */

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL || "redis://localhost:6379";

  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) {
        logger.error("Redis connection failed after 3 retries");
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  client.on("error", (err) => {
    logger.error("Redis client error", err);
  });

  client.on("connect", () => {
    logger.info("Redis connected");
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

export default redis;
