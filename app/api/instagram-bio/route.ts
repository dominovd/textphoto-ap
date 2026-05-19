import { NextResponse } from "next/server";
import { textPrompt, extractJsonArray, TOOL_MODELS } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const VIBE_INSTR: Record<string, string> = {
  aesthetic: "Aesthetic, dreamy, soft. Lots of ✨🌙☁️ if emojis allowed.",
  funny: "Funny, self-aware, slightly random. Punchy one-liners.",
  professional: "Professional, value-focused. Show authority without bragging.",
  inspirational: "Inspirational, growth-mindset, motivating.",
  edgy: "Edgy, confident, slightly cocky. Stand out.",
  cute: "Cute, warm, friendly. Hearts and pastel vibe.",
};

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip, "instagram-bio");
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
    const niche = (body.niche || "").toString().trim().slice(0, 200);
    const vibe = (body.vibe || "aesthetic").toString();
    const emojis = body.emojis !== false;
    const keywords = (body.keywords || "").toString().trim().slice(0, 200);

    if (!niche) {
      return NextResponse.json(
        { error: "Niche is required" },
        { status: 400 },
      );
    }

    const vibeInstr = VIBE_INSTR[vibe] || VIBE_INSTR.aesthetic;

    const prompt = `Generate exactly 10 Instagram bios for someone whose niche / focus is: "${niche}".

Tone: ${vibeInstr}
${keywords ? `Keywords to weave in naturally where possible: ${keywords}` : ""}
${emojis ? "Include 1-3 relevant emojis per bio." : "Do not include any emojis."}

Rules:
- Each bio must be UNDER 150 characters (Instagram bio limit).
- Each bio is one line. No line breaks within a single bio.
- Don't number them. No quotes around them.
- Vary the structures: some with a tagline, some with bullet-like dots (·), some with stacked phrases.

Return ONLY a JSON array of 10 strings. Example: ["bio 1", "bio 2", ...]`;

    const text = await textPrompt(prompt, {
      model: TOOL_MODELS.bio,
      maxTokens: 1000,
    });

    const lines = extractJsonArray(text)
      .slice(0, 10)
      .map((s) => String(s).trim())
      .filter(Boolean);

    const result = lines.map((line) => ({
      text: line,
      chars: line.length,
      overLimit: line.length > 150,
    }));

    return NextResponse.json({
      bios: result,
      remaining: limit.remaining,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/instagram-bio error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
