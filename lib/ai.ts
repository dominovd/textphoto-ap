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

// Cheap, fast model for text-only generation
export const MODEL_FAST = "claude-haiku-4-5-20251001";
// Vision-capable model for OCR / image understanding
export const MODEL_VISION = "claude-sonnet-4-5";

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
