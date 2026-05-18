import { NextResponse } from "next/server";
import { visionPrompt, extractJsonArray, validateImage } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip, "meme");
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

    const style = (form.get("style") as string) || "mixed";

    const STYLE_PROMPTS: Record<string, string> = {
      mixed:
        "Mix of formats: setup/punchline, single-line zinger, relatable observation, pop-culture reference, and one absurd take.",
      relatable:
        "All relatable observations — 'when you...' or 'me trying to...' format. Should feel like the reader's own thoughts.",
      savage:
        "Edgy, savage, slightly mean. Roasting style. Still funny, not cruel.",
      wholesome: "Wholesome, feel-good meme captions. Cute, kind, uplifting.",
      gen_z:
        "Gen-Z internet humour. Lowercase, slightly unhinged, ironic. References like 'no thoughts head empty', 'it's giving...', 'the way I...'.",
    };

    const styleHint = STYLE_PROMPTS[style] || STYLE_PROMPTS.mixed;

    const prompt = `Look at this image. Generate exactly 5 funny meme captions that match what's in it.

Style: ${styleHint}

Rules:
- Each caption under 100 characters
- Internet-native voice — punchy, scroll-stopping
- For "setup/punchline" use a slash: "When you finally finish work / on a Saturday"
- Don't add emojis unless they're the joke
- Don't repeat the image description — make the joke about it

Return ONLY a JSON array of 5 strings. Example: ["caption 1", "caption 2", ...]`;

    const text = await visionPrompt(file, prompt, 500);
    const lines = extractJsonArray(text).slice(0, 5);

    const result = lines.map((line) => {
      const t = String(line).trim();
      return { text: t, chars: t.length };
    });

    return NextResponse.json({ memes: result, remaining: limit.remaining });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/meme error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
