import { NextResponse } from "next/server";
import { visionPrompt, validateImage, TOOL_MODELS } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip, "handwriting");
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

    const prompt = `This image contains handwriting — print, cursive, notes, or letters. Extract the text EXACTLY as written, preserving line breaks and paragraph structure.

Rules:
- Do not add commentary, explanation, or markdown formatting.
- Mark genuinely illegible words as [unclear].
- Preserve original spelling, even if incorrect.
- If there is no handwriting in the image, output: NO_HANDWRITING_FOUND.

Output: just the extracted text, nothing else.`;

    const text = await visionPrompt(file, prompt, {
      // Use Haiku (better than Gemini Flash for handwriting in our experience)
      model: TOOL_MODELS.caption, // Haiku
      maxTokens: 2000,
    });

    if (text === "NO_HANDWRITING_FOUND" || !text) {
      return NextResponse.json({
        text: "",
        empty: true,
        message: "No handwriting detected in the image.",
        remaining: limit.remaining,
      });
    }

    return NextResponse.json({ text, remaining: limit.remaining });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/handwriting error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
