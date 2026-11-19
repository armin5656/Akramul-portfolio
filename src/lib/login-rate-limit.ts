import { createHash } from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

const LOGIN_WINDOW = "15 m";
const LOGIN_LIMIT = 5;

type RateLimitDecision =
  | { allowed: true }
  | { allowed: false; reason: "configuration" | "limited"; retryAfterSeconds?: number };

declare global {
  var loginRateLimiter: Ratelimit | undefined;
}

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getRateLimiter() {
  if (global.loginRateLimiter) return global.loginRateLimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  global.loginRateLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(LOGIN_LIMIT, LOGIN_WINDOW),
    prefix: "akramul-security:login",
    analytics: false,
  });

  return global.loginRateLimiter;
}

export async function limitLoginAttempt(
  request: NextRequest,
  email?: string
): Promise<RateLimitDecision> {
  const limiter = getRateLimiter();
  if (!limiter) return { allowed: false, reason: "configuration" };

  const ipKey = `ip:${hashIdentifier(getClientIp(request))}`;
  const accountKey = `account:${hashIdentifier((email || "unknown").trim().toLowerCase())}`;

  try {
    const [ipResult, accountResult] = await Promise.all([
      limiter.limit(ipKey),
      limiter.limit(accountKey),
    ]);

    if (ipResult.success && accountResult.success) return { allowed: true };

    const resetAt = Math.max(ipResult.reset, accountResult.reset);
    return {
      allowed: false,
      reason: "limited",
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
    };
  } catch {
    // Do not fall back to an in-memory counter in a serverless environment.
    // Failing closed prevents a Redis outage from disabling brute-force protection.
    console.error("[auth] Login rate limiter unavailable.");
    return { allowed: false, reason: "configuration" };
  }
}
