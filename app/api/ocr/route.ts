import { NextResponse } from "next/server";
import {
  getAnthropic,
  MODEL_VISION,
  imageBlock,
  fileToBase64,
} from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const language = (form.get("language") as string) || "auto-detect";

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 10 MB)" },
        { status: 413 },
      );
    }

    const prompt = `Extract ALL text from this image. Output the text exactly as it appears, preserving line breaks and structure. Do not add any commentary, explanation, markdown formatting, or wrapping. Output only the raw extracted text. If there is no text in the image, output exactly: NO_TEXT_FOUND.
${language !== "auto-detect" ? `The text is in: ${language}.` : ""}`;

    const { base64, mediaType } = await fileToBase64(file);
    const client = getAnthropic();

    const response = await client.messages.create({
      model: MODEL_VISION,
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [imageBlock(base64, mediaType), { type: "text", text: prompt }],
        },
      ],
    });

    const text = response.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join("")
      .trim();

    if (text === "NO_TEXT_FOUND" || !text) {
      return NextResponse.json({
        text: "",
        empty: true,
        message: "No text detected in the image.",
      });
    }

    return NextResponse.json({ text, language });
  } catch (err) {
    console.error("/api/ocr error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
