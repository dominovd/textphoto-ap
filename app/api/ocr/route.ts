import { NextResponse } from "next/server";
import { visionPrompt, validateImage } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip, "ocr");
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

    const language = (form.get("language") as string) || "auto-detect";

    const prompt = `Extract ALL text from this image. Output the text exactly as it appears, preserving line breaks and structure. Do not add any commentary, explanation, markdown formatting, or wrapping. Output only the raw extracted text. If there is no text in the image, output exactly: NO_TEXT_FOUND.
${language !== "auto-detect" ? `The text is in: ${language}.` : ""}`;

    const text = await visionPrompt(file, prompt, 2500);

    if (text === "NO_TEXT_FOUND" || !text) {
      return NextResponse.json({
        text: "",
        empty: true,
        message: "No text detected in the image.",
        remaining: limit.remaining,
      });
    }

    return NextResponse.json({ text, language, remaining: limit.remaining });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/ocr error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
