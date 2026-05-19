import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// =============================================================================
// AI client — 3-tier resilient routing
// =============================================================================
//
// Tier 1: OpenRouter primary model (per-tool, e.g. Gemini Flash for OCR)
// Tier 2: OpenRouter fallback model (e.g. Haiku)
// Tier 3: Anthropic SDK direct (catastrophic fallback if OpenRouter is down)
//
// Each tier is tried in order; we move to the next only on error. In practice
// almost all traffic resolves at Tier 1. Tier 3 is a safety net for the rare
// case where OpenRouter itself is unavailable.
// =============================================================================

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// --- Default models (override via env vars) ----------------------------------
const DEFAULT_PRIMARY = process.env.AI_PRIMARY_MODEL || "anthropic/claude-haiku-4.5";
const DEFAULT_FALLBACK = process.env.AI_FALLBACK_MODEL || "google/gemini-2.0-flash-001";

// Per-tool model routing — override individually via env vars without redeploy.
// Defaults follow cost/quality strategy: factual tasks → Gemini (cheap +
// equally good); creative tasks → Haiku / GPT-4o-mini (warmer tone).
export const TOOL_MODELS = {
  caption: process.env.AI_MODEL_CAPTION || "anthropic/claude-haiku-4.5",
  ocr: process.env.AI_MODEL_OCR || "google/gemini-2.0-flash-001",
  altText: process.env.AI_MODEL_ALT_TEXT || "google/gemini-2.0-flash-001",
  meme: process.env.AI_MODEL_MEME || "openai/gpt-4o-mini",
  bio: process.env.AI_MODEL_BIO || "anthropic/claude-haiku-4.5",
} as const;

// Tier 3 catastrophic fallback — direct to Anthropic if OpenRouter is unreachable.
const CATASTROPHIC_FALLBACK_MODEL = "claude-haiku-4-5-20251001";

// --- Clients (lazy) ----------------------------------------------------------

let openRouterClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

function getOpenRouter(): OpenAI {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY env var is not set. Get one at https://openrouter.ai/keys",
    );
  }
  if (!openRouterClient) {
    openRouterClient = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: OPENROUTER_BASE_URL,
      defaultHeaders: {
        "HTTP-Referer": "https://textphoto.app",
        "X-Title": "TextPhoto",
      },
    });
  }
  return openRouterClient;
}

function getAnthropic(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

// =============================================================================
// Image helpers
// =============================================================================

// OpenAI / OpenRouter format: data URL string
async function fileToDataUrl(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const mediaType = file.type || "image/jpeg";
  return `data:${mediaType};base64,${buf.toString("base64")}`;
}

// Anthropic SDK format: separate base64 + media type
async function fileToAnthropicImage(file: File): Promise<{
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
}> {
  const buf = Buffer.from(await file.arrayBuffer());
  const raw = file.type || "image/jpeg";
  const mediaType =
    raw === "image/png" || raw === "image/gif" || raw === "image/webp"
      ? raw
      : "image/jpeg";
  return { base64: buf.toString("base64"), mediaType };
}

// =============================================================================
// Provider calls
// =============================================================================

async function callOpenRouter(
  dataUrl: string,
  prompt: string,
  model: string,
  maxTokens: number,
): Promise<string> {
  const c = getOpenRouter();
  const response = await c.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: [
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: dataUrl } },
          { type: "text", text: prompt },
        ],
      },
    ],
  });
  return (response.choices[0]?.message?.content || "").trim();
}

async function callAnthropicDirect(
  file: File,
  prompt: string,
  maxTokens: number,
): Promise<string> {
  const a = getAnthropic();
  if (!a) {
    throw new Error(
      "Anthropic catastrophic fallback unavailable: ANTHROPIC_API_KEY not set",
    );
  }
  const { base64, mediaType } = await fileToAnthropicImage(file);
  const response = await a.messages.create({
    model: CATASTROPHIC_FALLBACK_MODEL,
    max_tokens: maxTokens,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64,
            },
          },
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

// =============================================================================
// Public API
// =============================================================================

export type VisionOptions = {
  model?: string;
  fallbackModel?: string;
  maxTokens?: number;
};

/**
 * Run a vision prompt with 3-tier resilient routing.
 *
 * Tier 1 → Tier 2 → Tier 3 on error. Returns raw text response.
 */
export async function visionPrompt(
  file: File,
  prompt: string,
  options: VisionOptions = {},
): Promise<string> {
  const primary = options.model || DEFAULT_PRIMARY;
  const fallback = options.fallbackModel || DEFAULT_FALLBACK;
  const maxTokens = options.maxTokens ?? 1500;
  const dataUrl = await fileToDataUrl(file);

  // Tier 1: OpenRouter primary
  try {
    return await callOpenRouter(dataUrl, prompt, primary, maxTokens);
  } catch (err1) {
    const msg1 = err1 instanceof Error ? err1.message : String(err1);
    console.warn(`[ai] tier1 (OpenRouter ${primary}) failed: ${msg1}`);

    // Tier 2: OpenRouter fallback model (skip if same as primary)
    if (primary !== fallback) {
      try {
        console.log(`[ai] tier2 retry → OpenRouter ${fallback}`);
        return await callOpenRouter(dataUrl, prompt, fallback, maxTokens);
      } catch (err2) {
        const msg2 = err2 instanceof Error ? err2.message : String(err2);
        console.warn(`[ai] tier2 (OpenRouter ${fallback}) failed: ${msg2}`);
      }
    }

    // Tier 3: Anthropic SDK direct (catastrophic fallback)
    try {
      console.log(
        `[ai] tier3 catastrophic fallback → Anthropic ${CATASTROPHIC_FALLBACK_MODEL}`,
      );
      return await callAnthropicDirect(file, prompt, maxTokens);
    } catch (err3) {
      const msg3 = err3 instanceof Error ? err3.message : String(err3);
      console.error(`[ai] all tiers failed. tier3 error: ${msg3}`);
      // Re-throw the original (tier1) error since it's most representative
      throw err1;
    }
  }
}

// =============================================================================
// Text-only prompt (no image) — for Bio / pure-text tools
// =============================================================================

export type TextOptions = {
  model?: string;
  fallbackModel?: string;
  maxTokens?: number;
};

/**
 * Text-only prompt with 3-tier fallback (OpenRouter primary, OpenRouter
 * fallback, Anthropic direct). Returns raw text response.
 */
export async function textPrompt(
  prompt: string,
  options: TextOptions = {},
): Promise<string> {
  const primary = options.model || DEFAULT_PRIMARY;
  const fallback = options.fallbackModel || DEFAULT_FALLBACK;
  const maxTokens = options.maxTokens ?? 1500;

  const callOR = async (model: string): Promise<string> => {
    const c = getOpenRouter();
    const response = await c.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });
    return (response.choices[0]?.message?.content || "").trim();
  };

  try {
    return await callOR(primary);
  } catch (err1) {
    const msg1 = err1 instanceof Error ? err1.message : String(err1);
    console.warn(`[ai-text] tier1 (${primary}) failed: ${msg1}`);
    if (primary !== fallback) {
      try {
        console.log(`[ai-text] tier2 retry → ${fallback}`);
        return await callOR(fallback);
      } catch (err2) {
        const msg2 = err2 instanceof Error ? err2.message : String(err2);
        console.warn(`[ai-text] tier2 (${fallback}) failed: ${msg2}`);
      }
    }
    // Tier 3: Anthropic direct
    try {
      const a = getAnthropic();
      if (!a) throw new Error("Anthropic fallback unavailable");
      console.log("[ai-text] tier3 catastrophic fallback → Anthropic direct");
      const response = await a.messages.create({
        model: CATASTROPHIC_FALLBACK_MODEL,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      });
      return response.content
        .filter((c) => c.type === "text")
        .map((c) => (c as { type: "text"; text: string }).text)
        .join("")
        .trim();
    } catch (err3) {
      console.error("[ai-text] all tiers failed:", err3);
      throw err1;
    }
  }
}

// =============================================================================
// Response parsing
// =============================================================================

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
    .split(/\r?\n+/)
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

// =============================================================================
// Request validation
// =============================================================================

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
