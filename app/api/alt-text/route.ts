import { NextResponse } from "next/server";
import { visionPrompt, extractJsonObject, validateImage } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

type AltTextResponse = {
  short: string;
  medium: string;
  detailed: string;
};

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip, "alt-text");
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

    const prompt = `You are writing alt text for accessibility and SEO.
Look at this image and generate 3 alt text variations:

1. "short" — under 80 characters, snappy, covers the main subject
2. "medium" — 80 to 125 characters, descriptive but concise, includes context
3. "detailed" — 125 to 200 characters, for complex images, includes setting/mood

Guidelines:
- Start with the most important visual element
- Don't begin with "Image of" or "Picture of"
- Be concrete and specific (colors, action, setting)
- Don't include subjective interpretation unless visually clear

Return ONLY a JSON object: { "short": "...", "medium": "...", "detailed": "..." }
Output JSON only, no other text.`;

    const text = await visionPrompt(file, prompt, 400);
    const parsed = extractJsonObject<AltTextResponse>(text);

    if (!parsed || !parsed.short || !parsed.medium || !parsed.detailed) {
      return NextResponse.json(
        { error: "Could not parse alt text response", raw: text },
        { status: 500 },
      );
    }

    return NextResponse.json({
      variants: [
        {
          name: "Short",
          label: "Best for SEO + quick screen readers",
          text: parsed.short,
          chars: parsed.short.length,
        },
        {
          name: "Medium",
          label: "Recommended — balanced",
          text: parsed.medium,
          chars: parsed.medium.length,
        },
        {
          name: "Detailed",
          label: "For complex images",
          text: parsed.detailed,
          chars: parsed.detailed.length,
        },
      ],
      remaining: limit.remaining,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/alt-text error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
