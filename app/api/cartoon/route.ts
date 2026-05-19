import { NextResponse } from "next/server";
import { validateImage } from "@/lib/ai";
import { cartoonize } from "@/lib/fal";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip, "cartoon");
  if (!limit.ok) {
    return NextResponse.json(
      { error: limit.error, reason: limit.reason },
      {
        status: limit.status,
        headers: { "Retry-After": String(limit.retryAfter) },
      },
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    validateImage(file);

    const start = Date.now();
    const { resultUrl, provider } = await cartoonize(file);
    const ms = Date.now() - start;

    return NextResponse.json({
      url: resultUrl,
      provider,
      ms,
      remaining: limit.remaining,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/cartoon error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
