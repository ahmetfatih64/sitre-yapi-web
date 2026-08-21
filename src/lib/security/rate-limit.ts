import { env } from "@/lib/env";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const memory = new Map<string, Bucket>();

function memoryLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number
): RateLimitResult {
  const existing = memory.get(key);
  if (!existing || existing.resetAt <= now) {
    const bucket = { count: 1, resetAt: now + windowMs };
    memory.set(key, bucket);
    return { allowed: true, remaining: limit - 1, resetAt: bucket.resetAt };
  }
  existing.count += 1;
  const allowed = existing.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

async function upstashLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  // Shape-compatible fallback; real Upstash `@upstash/ratelimit` plugs in later.
  // We keep the interface so callers don't change.
  const resetAt = Date.now() + windowMs;
  const url = `${env.UPSTASH_REDIS_REST_URL}/pipeline`;
  const body = JSON.stringify([
    ["INCR", key],
    ["PEXPIRE", key, String(windowMs), "NX"],
  ]);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`upstash ${r.status}`);
    const data = (await r.json()) as Array<{ result: number | string }>;
    const count = Number(data[0]?.result ?? 0);
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt,
    };
  } catch (e) {
    // Fail-open to avoid outage-driven lockout; still log.
    console.warn("[rate-limit] upstash failed, allowing", e);
    return { allowed: true, remaining: limit - 1, resetAt };
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (env.HAS_UPSTASH) return upstashLimit(key, limit, windowMs);
  return memoryLimit(key, limit, windowMs, Date.now());
}
