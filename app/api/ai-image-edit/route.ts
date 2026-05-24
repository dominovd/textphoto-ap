import { NextResponse } from "next/server";
import { validateImage } from "@/lib/ai";
import { editImageWithPrompt } from "@/lib/fal";
import { checkImageGenRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PROMPT = 500;
const ALLOWED_ASPECT: ReadonlyArray<"1:1" | "16:9" | "9:16" | "4:3" | "3:4"> = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
  "3:4",
];

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
    const prompt = String(form.get("prompt") || "")
      .trim()
      .slice(0, MAX_PROMPT);
    const aspectRaw = String(form.get("aspectRatio") || "").trim();
    const aspectRatio = ALLOWED_ASPECT.find((a) => a === aspectRaw);

    validateImage(file);
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required (describe the edit you want)" },
        { status: 400 },
      );
    }

    const start = Date.now();
    const { resultUrl, provider } = await editImageWithPrompt(
      file,
      prompt,
      aspectRatio,
    );
    const ms = Date.now() - start;

    return NextResponse.json({
      url: resultUrl,
      provider,
      ms,
      remaining: limit.remaining,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/ai-image-edit error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
