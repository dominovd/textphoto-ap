import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY env var is not set");
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

// Default model — Haiku 4.5 supports vision and is ~3x cheaper than Sonnet.
// Override per-call by passing a different model to visionPrompt() if needed.
export const MODEL_VISION = "claude-haiku-4-5-20251001";
// Premium model for cases where Haiku quality isn't enough (currently unused;
// reserved for a future "Pro" tier or high-stakes tools).
export const MODEL_PREMIUM = "claude-sonnet-4-6";

// Convert a base64 string to the Anthropic image block format
export function imageBlock(base64: string, mediaType: string) {
  return {
    type: "image" as const,
    source: {
      type: "base64" as const,
      media_type: mediaType as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp",
      data: base64,
    },
  };
}

// Helper: convert FormData image File to base64
export async function fileToBase64(
  file: File,
): Promise<{ base64: string; mediaType: string }> {
  const buf = Buffer.from(await file.arrayBuffer());
  return {
    base64: buf.toString("base64"),
    mediaType: file.type || "image/jpeg",
  };
}

/**
 * Run a single vision prompt against the Claude vision model.
 * Returns the raw text response.
 */
export async function visionPrompt(
  file: File,
  prompt: string,
  maxTokens = 1500,
): Promise<string> {
  const { base64, mediaType } = await fileToBase64(file);
  const c = getAnthropic();
  const response = await c.messages.create({
    model: MODEL_VISION,
    max_tokens: maxTokens,
    messages: [
      {
        role: "user",
        content: [
          imageBlock(base64, mediaType),
          { type: "text", text: prompt },
        ],
      },
    ],
  });
  return response.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { type: "text"; text: string }).text)
    .join("")
    .trim();
}

/**
 * Try to extract a JSON array from a model response.
 * Falls back to splitting by lines if no JSON found.
 */
export function extractJsonArray(text: string): string[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // fall through
    }
  }
  return text
    .split(/\n+/)
    .map((l) =>
      l
        .replace(/^\s*[-*\d.)\]]+\s*/, "")
        .replace(/^["']|["',]+$/g, "")
        .trim(),
    )
    .filter(Boolean);
}

/**
 * Try to extract a JSON object from a model response.
 */
export function extractJsonObject<T = unknown>(text: string): T | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}

/**
 * Validate an uploaded image file. Throws Response on failure.
 */
export function validateImage(file: File | null): asserts file is File {
  if (!file) {
    throw new Response(JSON.stringify({ error: "No image uploaded" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Response(
      JSON.stringify({ error: "Image too large (max 10 MB)" }),
      { status: 413, headers: { "content-type": "application/json" } },
    );
  }
}
