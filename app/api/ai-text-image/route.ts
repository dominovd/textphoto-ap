import { NextResponse } from "next/server";
import { aiTextImage } from "@/lib/fal";
import { checkImageGenRateLimit, getClientIp } from "@/lib/ratelimit";
import { getStyle, buildPrompt } from "@/lib/text-effect-styles";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await checkImageGenRateLimit(ip);
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
    const body = await req.json().catch(() => ({}));
    const text = String(body.text || "").trim().slice(0, 32);
    const styleId = String(body.styleId || "");

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 },
      );
    }
    const style = getStyle(styleId);
    if (!style) {
      return NextResponse.json(
        { error: "Unknown style" },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(style, text);

    const start = Date.now();
    const { resultUrl, provider } = await aiTextImage(
      prompt,
      style.aspectRatio || "16:9",
    );
    const ms = Date.now() - start;

    return NextResponse.json({
      url: resultUrl,
      provider,
      style: style.id,
      text,
      ms,
      remaining: limit.remaining,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/ai-text-image error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
