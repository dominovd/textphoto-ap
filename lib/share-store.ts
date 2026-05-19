import { Redis } from "@upstash/redis";

/**
 * Share store — saves shared image metadata in Upstash so /s/[id] pages can
 * look it up for OG tags and remix links. Image itself lives in Vercel Blob.
 */

const TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

export type ShareRecord = {
  url: string; // Vercel Blob URL
  text: string; // user text
  styleId: string; // text-effect style id
  createdAt: number; // unix ms
};

export async function saveShare(
  id: string,
  record: ShareRecord,
): Promise<void> {
  const r = getRedis();
  if (!r) throw new Error("Upstash not configured");
  await r.set(`share:${id}`, JSON.stringify(record), { ex: TTL_SECONDS });
}

export async function getShare(id: string): Promise<ShareRecord | null> {
  const r = getRedis();
  if (!r) return null;
  const raw = await r.get<string | ShareRecord>(`share:${id}`);
  if (!raw) return null;
  // Upstash JS client sometimes returns parsed JSON, sometimes string
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as ShareRecord;
    } catch {
      return null;
    }
  }
  return raw;
}

/** Short, URL-safe share ID: timestamp + random suffix. ~10 chars. */
export function newShareId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return ts + rand;
}
