/**
 * Edge-compatible Redis client for middleware.
 * Uses the Upstash REST API via native fetch (works in Edge Runtime).
 *
 * Requires:
 *   UPSTASH_REDIS_REST_URL - e.g. https://your-instance.upstash.io
 *   UPSTASH_REDIS_REST_TOKEN - Upstash REST API token
 *
 * Falls back gracefully (returns null) when env vars are missing or Redis is unreachable.
 */

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * GET a key from Upstash Redis via REST API.
 * Returns the value as a string, or null if not found / error.
 */
export async function edgeRedisGet(key: string): Promise<string | null> {
  if (!REST_URL || !REST_TOKEN) return null;

  try {
    const res = await fetch(`${REST_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${REST_TOKEN}` },
      // Short timeout to avoid blocking middleware
      signal: AbortSignal.timeout(1500),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { result: string | null };
    return data.result;
  } catch {
    // Redis down or timeout — fail open (allow traffic)
    return null;
  }
}

/**
 * SET a key in Upstash Redis via REST API.
 */
export async function edgeRedisSet(key: string, value: string, exSeconds?: number): Promise<boolean> {
  if (!REST_URL || !REST_TOKEN) return false;

  try {
    const path = exSeconds
      ? `${REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/ex/${exSeconds}`
      : `${REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`;

    const res = await fetch(path, {
      headers: { Authorization: `Bearer ${REST_TOKEN}` },
      signal: AbortSignal.timeout(1500),
    });

    return res.ok;
  } catch {
    return false;
  }
}
