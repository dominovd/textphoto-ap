import { NextResponse } from "next/server";
import { visionPrompt, extractJsonArray, validateImage } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const VIBE_INSTRUCTIONS: Record<string, string> = {
  aesthetic:
    "Aesthetic, moody, poetic. Short to medium length. Calm, dreamy tone.",
  funny: "Funny, witty, self-aware humour. Punchy one-liners.",
  romantic: "Romantic, warm. Heartfelt but not cheesy.",
  savage: "Confident, savage with edge. Empowering, slightly cocky.",
  professional: "Professional, thoughtful, value-driven, not corporate.",
  inspirational: "Inspirational, encouraging, motivational, not preachy.",
};

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  instagram:
    "Format: Instagram captions. Length 1-3 lines. Up to ~280 chars. Storytelling and aesthetic are valued.",
  tiktok:
    "Format: TikTok captions. SHORT — strong hook in first 3 words, under 100 chars each. Punchy, scroll-stopping. Include 2-3 trending hashtags like #fyp #foryou #viral plus topic-specific.",
  universal:
    "Format: universal caption for any platform. Short to medium length (under 200 chars). Work for IG, FB, X.",
};

const VIBE_HASHTAGS: Record<string, string[]> = {
  aesthetic: ["#aesthetic", "#moodygrams", "#goldenhour", "#softlight"],
  funny: ["#lol", "#mood", "#sorrynotsorry", "#randomthoughts"],
  romantic: ["#couplegoals", "#love", "#forever", "#mybetterhalf"],
  savage: ["#mindset", "#focus", "#stayhumble", "#builtdifferent"],
  professional: ["#worklife", "#leadership", "#growth"],
  inspirational: ["#motivation", "#growthmindset", "#keepgoing"],
};

export async function POST(req: Request) {
  // Rate limit FIRST — before doing any expensive work
  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip, "caption");
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

    const platform = (form.get("platform") as string) || "instagram";
    const vibe = (form.get("vibe") as string) || "aesthetic";
    const hashtags = form.get("hashtags") === "true";
    const emojis = form.get("emojis") === "true";

    const vibeInstr = VIBE_INSTRUCTIONS[vibe] || VIBE_INSTRUCTIONS.aesthetic;
    const platformInstr =
      PLATFORM_INSTRUCTIONS[platform] || PLATFORM_INSTRUCTIONS.instagram;
    const hashtagHint = hashtags
      ? `Include 2-3 relevant hashtags at the end. Suggested base: ${VIBE_HASHTAGS[vibe]?.join(" ") || ""}.`
      : "Do not include any hashtags.";
    const emojiHint = emojis
      ? "Include 1-2 relevant emojis where natural."
      : "Do not include any emojis.";

    const prompt = `Look at this image. Generate exactly 10 captions for it.

${platformInstr}
Tone: ${vibeInstr}
${hashtagHint}
${emojiHint}

Return ONLY a JSON array of 10 strings, nothing else. Example: ["caption 1", "caption 2", ...]
Each caption on one line.`;

    const text = await visionPrompt(file, prompt, 1200);
    const lines = extractJsonArray(text).slice(0, 10);

    const result = lines.map((line) => {
      const t = String(line).trim();
      const hashtagCount = (t.match(/#\w+/g) || []).length;
      return { text: t, chars: t.length, hashtags: hashtagCount };
    });

    return NextResponse.json({
      captions: result,
      remaining: limit.remaining,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/caption error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
