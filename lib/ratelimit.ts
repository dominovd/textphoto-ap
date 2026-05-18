import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// --- Tunable defaults --------------------------------------------------------
// Per-IP per-endpoint limits
const HOURLY_PER_IP = 7;
const DAILY_PER_IP = 15;
// Global safety cap across ALL endpoints + ALL users
// 1000 ~= $5/day at Haiku 4.5 (~$0.005/call)
const GLOBAL_DAILY_CAP =
  Number(process.env.DAILY_AI_BUDGET_CALLS) || 1000;

// -----------------------------------------------------------------------------

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return Redis.fromEnv();
}

type Limiters = {
  hourly: Ratelimit;
  daily: Ratelimit;
  global: Ratelimit;
};

let cached: Limiters | null = null;

function getLimiters(): Limiters | null {
  if (cached) return cached;
  const redis = getRedis();
  if (!redis) return null;
  cached = {
    hourly: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(HOURLY_PER_IP, "1 h"),
      prefix: "tp:h",
      analytics: true,
    }),
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DAILY_PER_IP, "24 h"),
      prefix: "tp:d",
      analytics: true,
    }),
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(GLOBAL_DAILY_CAP, "24 h"),
      prefix: "tp:g",
      analytics: true,
    }),
  };
  return cached;
}

export type RateLimitResult =
  | { ok: true; remaining: { hourly: number; daily: number } }
  | {
      ok: false;
      status: number;
      error: string;
      retryAfter: number; // seconds
      reason: "hourly" | "daily" | "global";
    };

export async function checkRateLimit(
  ip: string,
  endpoint: string,
): Promise<RateLimitResult> {
  const lim = getLimiters();
  if (!lim) {
    // Upstash not configured — fail open with a warning in the log.
    // This lets the app run in dev without Redis. Production WILL warn loudly.
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "RATE LIMIT DISABLED: Upstash env vars missing. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel.",
      );
    }
    return { ok: true, remaining: { hourly: -1, daily: -1 } };
  }

  // 1. Global cap (site-wide budget)
  const g = await lim.global.limit("all");
  if (!g.success) {
    return {
      ok: false,
      status: 503,
      reason: "global",
      error:
        "Today's free AI generations are used up across the whole site. Resets at 00:00 UTC. Our text-effect tools (fire, neon, bubble, …) still work — no AI required.",
      retryAfter: Math.max(1, Math.ceil((g.reset - Date.now()) / 1000)),
    };
  }

  const id = `${ip}:${endpoint}`;

  // 2. Per-IP daily
  const d = await lim.daily.limit(id);
  if (!d.success) {
    const hours = Math.ceil((d.reset - Date.now()) / (60 * 60 * 1000));
    return {
      ok: false,
      status: 429,
      reason: "daily",
      error: `You've used your daily limit (${DAILY_PER_IP} generations per tool per day). Resets in ${hours}h.`,
      retryAfter: Math.max(1, Math.ceil((d.reset - Date.now()) / 1000)),
    };
  }

  // 3. Per-IP hourly
  const h = await lim.hourly.limit(id);
  if (!h.success) {
    const mins = Math.ceil((h.reset - Date.now()) / 60000);
    return {
      ok: false,
      status: 429,
      reason: "hourly",
      error: `You've used your hourly limit (${HOURLY_PER_IP} generations per tool per hour). Try again in ${mins} min.`,
      retryAfter: Math.max(1, Math.ceil((h.reset - Date.now()) / 1000)),
    };
  }

  return {
    ok: true,
    remaining: { hourly: h.remaining, daily: d.remaining },
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "anonymous";
}
