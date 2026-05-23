import { NextResponse } from "next/server";
import { validateImage } from "@/lib/ai";
import { petPortrait } from "@/lib/fal";
import { checkImageGenRateLimit, getClientIp } from "@/lib/ratelimit";
import { getPetStyle, buildPetPrompt } from "@/lib/pet-portrait-styles";

export const runtime = "nodejs";
// Nano Banana edit typically 5-15s but cold starts can push it past 30s
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
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const styleId = String(form.get("styleId") || "").trim();
    const customNotes = String(form.get("customNotes") || "")
      .trim()
      .slice(0, 200);

    validateImage(file);

    const style = getPetStyle(styleId);
    if (!style) {
      return NextResponse.json(
        { error: "Unknown style" },
        { status: 400 },
      );
    }

    const prompt = buildPetPrompt(style, customNotes);

    const start = Date.now();
    const { resultUrl, provider } = await petPortrait(file, prompt);
    const ms = Date.now() - start;

    return NextResponse.json({
      url: resultUrl,
      provider,
      style: style.id,
      ms,
      remaining: limit.remaining,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/pet-portrait error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
