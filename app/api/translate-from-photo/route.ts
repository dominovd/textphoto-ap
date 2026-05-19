import { NextResponse } from "next/server";
import { visionPrompt, validateImage, TOOL_MODELS } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip, "translate");
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

    const targetLanguage =
      (form.get("targetLanguage") as string) || "English";

    const prompt = `You are doing OCR and translation in one step.

1. Extract ALL text from this image (signs, menus, documents, handwriting, anything).
2. Translate the extracted text into ${targetLanguage}.
3. Preserve line breaks and paragraph structure from the original.

Output a JSON object with this exact shape:
{ "original": "<text exactly as in image>", "translated": "<text in ${targetLanguage}>", "sourceLanguage": "<detected source language>" }

Output ONLY the JSON object, no other text. If no text found in image, return { "original": "", "translated": "", "sourceLanguage": "" }.`;

    const text = await visionPrompt(file, prompt, {
      model: TOOL_MODELS.ocr, // Gemini Flash — cheap + great at OCR
      maxTokens: 2000,
    });

    // Parse JSON
    let parsed: {
      original: string;
      translated: string;
      sourceLanguage: string;
    } | null = null;
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        // fall through
      }
    }

    if (!parsed || (!parsed.original && !parsed.translated)) {
      return NextResponse.json({
        empty: true,
        message: "No text detected in the image.",
        targetLanguage,
        remaining: limit.remaining,
      });
    }

    return NextResponse.json({
      original: parsed.original || "",
      translated: parsed.translated || "",
      sourceLanguage: parsed.sourceLanguage || "Unknown",
      targetLanguage,
      remaining: limit.remaining,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/translate-from-photo error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
