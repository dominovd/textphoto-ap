import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// --- Tunable defaults --------------------------------------------------------
// Per-IP, per-endpoint, per hour. Sliding window.
const PER_ENDPOINT_HOURLY = 3;
// Per-IP, aggregated across ALL AI endpoints, per hour. Sliding window.
const PER_IP_HOURLY = 7;
// Per-IP, aggregated across ALL AI endpoints, per day. Sliding window.
const PER_IP_DAILY = 10;
// Global safety cap across all users + all endpoints. Fixed window (resets 00:00 UTC).
// 1000 ≈ $5/day at current per-tool routing prices.
const GLOBAL_DAILY_CAP =
  Number(process.env.DAILY_AI_BUDGET_CALLS) || 1000;

// --- Image generation limits (separate budget, much pricier per call) --------
// Image-gen endpoints (Nano Banana / Ideogram via fal.ai) cost ~$0.04 per call.
// Tighter per-IP limits to spread the $3/day budget across more unique users.
//
// TEMPORARY (May 2026): hourly+daily bumped to 15 to generate the showcase
// carousel for the homepage. Revert to 1/3 after the batch is complete.
const IMAGEGEN_PER_IP_HOURLY = 15;
const IMAGEGEN_PER_IP_DAILY = 15;
// 200 calls ≈ $8/day at Nano Banana pricing (temporarily up from 75 for batch).
const IMAGEGEN_GLOBAL_DAILY =
  Number(process.env.DAILY_IMAGEGEN_BUDGET_CALLS) || 200;

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
  perEndpointHourly: Ratelimit;
  ipHourly: Ratelimit;
  ipDaily: Ratelimit;
  global: Ratelimit;
  imagegenIpHourly: Ratelimit;
  imagegenIpDaily: Ratelimit;
  imagegenGlobal: Ratelimit;
};

let cached: Limiters | null = null;

function getLimiters(): Limiters | null {
  if (cached) return cached;
  const redis = getRedis();
  if (!redis) return null;
  cached = {
    perEndpointHourly: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_ENDPOINT_HOURLY, "1 h"),
      prefix: "tp:eh",
      analytics: true,
    }),
    ipHourly: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_IP_HOURLY, "1 h"),
      prefix: "tp:ih",
      analytics: true,
    }),
    ipDaily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_IP_DAILY, "24 h"),
      prefix: "tp:id",
      analytics: true,
    }),
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(GLOBAL_DAILY_CAP, "24 h"),
      prefix: "tp:g",
      analytics: true,
    }),
    // Image-gen separate counters (different budget bucket)
    imagegenIpHourly: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(IMAGEGEN_PER_IP_HOURLY, "1 h"),
      prefix: "tp:igh",
      analytics: true,
    }),
    imagegenIpDaily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(IMAGEGEN_PER_IP_DAILY, "24 h"),
      prefix: "tp:igd",
      analytics: true,
    }),
    imagegenGlobal: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(IMAGEGEN_GLOBAL_DAILY, "24 h"),
      prefix: "tp:igg",
      analytics: true,
    }),
  };
  return cached;
}

/**
 * Separate rate-limit check for image-generation endpoints (Nano Banana etc.)
 * Tighter per-IP limits + separate global budget bucket.
 */
export async function checkImageGenRateLimit(
  ip: string,
): Promise<RateLimitResult> {
  const lim = getLimiters();
  if (!lim) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "RATE LIMIT DISABLED: Upstash env vars missing. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
      );
    }
    return {
      ok: true,
      remaining: { perEndpointHourly: -1, ipHourly: -1, ipDaily: -1 },
    };
  }

  // 1. Global image-gen budget ($3/day)
  const g = await lim.imagegenGlobal.limit("imagegen");
  if (!g.success) {
    return {
      ok: false,
      status: 503,
      reason: "global",
      error:
        "Today's free AI image generations are used up across the whole site. Resets at 00:00 UTC. Our other tools (captions, OCR, text effects) still work.",
      retryAfter: Math.max(1, Math.ceil((g.reset - Date.now()) / 1000)),
    };
  }

  // 2. Per-IP daily (3/day for image gen)
  const d = await lim.imagegenIpDaily.limit(ip);
  if (!d.success) {
    const hours = Math.ceil((d.reset - Date.now()) / (60 * 60 * 1000));
    return {
      ok: false,
      status: 429,
      reason: "ip_daily",
      error: `You've used your daily limit for image generation (${IMAGEGEN_PER_IP_DAILY} per day). Resets in ${hours}h. Try our other tools in the meantime.`,
      retryAfter: Math.max(1, Math.ceil((d.reset - Date.now()) / 1000)),
    };
  }

  // 3. Per-IP hourly (1/hour for image gen)
  const h = await lim.imagegenIpHourly.limit(ip);
  if (!h.success) {
    const mins = Math.ceil((h.reset - Date.now()) / 60000);
    return {
      ok: false,
      status: 429,
      reason: "ip_hourly",
      error: `Image generation is limited to ${IMAGEGEN_PER_IP_HOURLY} per hour to keep this tool free. Try again in ${mins} min.`,
      retryAfter: Math.max(1, Math.ceil((h.reset - Date.now()) / 1000)),
    };
  }

  return {
    ok: true,
    remaining: {
      perEndpointHourly: h.remaining,
      ipHourly: h.remaining,
      ipDaily: d.remaining,
    },
  };
}

export type RateLimitResult =
  | {
      ok: true;
      remaining: {
        perEndpointHourly: number;
        ipHourly: number;
        ipDaily: number;
      };
    }
  | {
      ok: false;
      status: number;
      error: string;
      retryAfter: number; // seconds
      reason: "global" | "ip_daily" | "ip_hourly" | "endpoint_hourly";
    };

export async function checkRateLimit(
  ip: string,
  endpoint: string,
): Promise<RateLimitResult> {
  const lim = getLimiters();
  if (!lim) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "RATE LIMIT DISABLED: Upstash env vars missing. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel.",
      );
    }
    return {
      ok: true,
      remaining: { perEndpointHourly: -1, ipHourly: -1, ipDaily: -1 },
    };
  }

  // 1. Global site-wide budget (cheapest check; doesn't touch user counters if exhausted)
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

  // 2. Per-endpoint hourly (most specific — fails first when spamming one tool)
  const epH = await lim.perEndpointHourly.limit(`${ip}:${endpoint}`);
  if (!epH.success) {
    const mins = Math.ceil((epH.reset - Date.now()) / 60000);
    return {
      ok: false,
      status: 429,
      reason: "endpoint_hourly",
      error: `You've used your hourly limit for this tool (${PER_ENDPOINT_HOURLY} per hour). Try a different tool or come back in ${mins} min.`,
      retryAfter: Math.max(1, Math.ceil((epH.reset - Date.now()) / 1000)),
    };
  }

  // 3. Per-IP hourly aggregate (across all AI tools)
  const ipH = await lim.ipHourly.limit(ip);
  if (!ipH.success) {
    const mins = Math.ceil((ipH.reset - Date.now()) / 60000);
    return {
      ok: false,
      status: 429,
      reason: "ip_hourly",
      error: `You've used your hourly limit across all AI tools (${PER_IP_HOURLY} per hour). Try again in ${mins} min.`,
      retryAfter: Math.max(1, Math.ceil((ipH.reset - Date.now()) / 1000)),
    };
  }

  // 4. Per-IP daily aggregate (across all AI tools)
  const ipD = await lim.ipDaily.limit(ip);
  if (!ipD.success) {
    const hours = Math.ceil((ipD.reset - Date.now()) / (60 * 60 * 1000));
    return {
      ok: false,
      status: 429,
      reason: "ip_daily",
      error: `You've used your daily limit across all AI tools (${PER_IP_DAILY} per day). Resets in ${hours}h.`,
      retryAfter: Math.max(1, Math.ceil((ipD.reset - Date.now()) / 1000)),
    };
  }

  return {
    ok: true,
    remaining: {
      perEndpointHourly: epH.remaining,
      ipHourly: ipH.remaining,
      ipDaily: ipD.remaining,
    },
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "anonymous";
}
