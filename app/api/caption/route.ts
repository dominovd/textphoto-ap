import { NextResponse } from "next/server";
import {
  getAnthropic,
  MODEL_VISION,
  imageBlock,
  fileToBase64,
} from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

const VIBE_INSTRUCTIONS: Record<string, string> = {
  aesthetic:
    "Aesthetic, moody, poetic Instagram captions. Short to medium length. Calm, dreamy tone.",
  funny:
    "Funny, witty Instagram captions with self-aware humour. Punchy one-liners.",
  romantic:
    "Romantic, warm Instagram captions. Heartfelt but not cheesy.",
  savage:
    "Confident, savage Instagram captions with edge. Empowering, slightly cocky.",
  professional:
    "Professional LinkedIn-style captions. Thoughtful, value-driven, not corporate.",
  inspirational:
    "Inspirational Instagram captions. Encouraging, motivational, not preachy.",
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
  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const vibe = (form.get("vibe") as string) || "aesthetic";
    const hashtags = form.get("hashtags") === "true";
    const emojis = form.get("emojis") === "true";

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 10 MB)" },
        { status: 413 },
      );
    }

    const instruction =
      VIBE_INSTRUCTIONS[vibe] || VIBE_INSTRUCTIONS.aesthetic;
    const hashtagHint = hashtags
      ? `Include 2-3 relevant hashtags at the end. Suggested base: ${VIBE_HASHTAGS[vibe]?.join(" ") || ""}.`
      : "Do not include any hashtags.";
    const emojiHint = emojis
      ? "Include 1-2 relevant emojis where natural."
      : "Do not include any emojis.";

    const prompt = `Look at this image. Generate exactly 10 Instagram captions for it.

Style: ${instruction}
${hashtagHint}
${emojiHint}

Return ONLY a JSON array of 10 strings, nothing else. Example: ["caption 1", "caption 2", ...]
Each caption should be 1 line, max 280 characters.`;

    const { base64, mediaType } = await fileToBase64(file);
    const client = getAnthropic();

    const response = await client.messages.create({
      model: MODEL_VISION,
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [imageBlock(base64, mediaType), { type: "text", text: prompt }],
        },
      ],
    });

    // Extract text from response
    const text = response.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join("")
      .trim();

    // Try to extract JSON array
    let captions: string[] = [];
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        captions = JSON.parse(match[0]);
      } catch {
        captions = text
          .split(/\n+/)
          .map((l) => l.replace(/^\s*[-*\d.]+\s*/, "").replace(/^["']|["']$/g, "").trim())
          .filter(Boolean)
          .slice(0, 10);
      }
    } else {
      captions = text
        .split(/\n+/)
        .map((l) => l.replace(/^\s*[-*\d.]+\s*/, "").replace(/^["']|["']$/g, "").trim())
        .filter(Boolean)
        .slice(0, 10);
    }

    const result = captions.map((line) => {
      const text = String(line).trim();
      const hashtagCount = (text.match(/#\w+/g) || []).length;
      return { text, chars: text.length, hashtags: hashtagCount };
    });

    return NextResponse.json({ captions: result });
  } catch (err) {
    console.error("/api/caption error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
