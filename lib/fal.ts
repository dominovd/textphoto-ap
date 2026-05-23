import { fal } from "@fal-ai/client";

// =============================================================================
// Image-to-image AI provider — fal.ai primary, Replicate fallback
// =============================================================================
//
// Why fal.ai primary:
//   - Cheapest per-call pricing for popular image-to-image models (~$0.001 for rembg)
//   - Fast cold starts (2-5 sec vs Replicate's 10-30 sec)
//   - Modern SDK with sync `subscribe()` API
//
// Why Replicate fallback:
//   - Wider model catalog and longer track record
//   - Direct HTTP API (no SDK dep needed — just fetch + token)
//   - Resilience if fal.ai has an outage
// =============================================================================

let falConfigured = false;

function ensureFal() {
  if (falConfigured) return;
  if (!process.env.FAL_KEY) {
    throw new Error(
      "FAL_KEY env var is not set. Get one at https://fal.ai/dashboard/keys",
    );
  }
  fal.config({ credentials: process.env.FAL_KEY });
  falConfigured = true;
}

// -----------------------------------------------------------------------------
// Background remove — fal.ai primary
// -----------------------------------------------------------------------------

async function falRemoveBackground(file: File): Promise<string> {
  ensureFal();
  // Upload image to fal storage first — supports larger files than data URLs
  const imageUrl = await fal.storage.upload(file);

  const result = await fal.subscribe("fal-ai/imageutils/rembg", {
    input: { image_url: imageUrl },
    logs: false,
  });

  const data = result.data as { image?: { url: string } } | undefined;
  if (!data?.image?.url) {
    throw new Error("fal.ai returned no image URL");
  }
  return data.image.url;
}

// -----------------------------------------------------------------------------
// Background remove — Replicate fallback
// -----------------------------------------------------------------------------

async function replicateRemoveBackground(file: File): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN env var is not set");
  }

  // Convert file to base64 data URL for Replicate input
  const buf = Buffer.from(await file.arrayBuffer());
  const mediaType = file.type || "image/png";
  const dataUrl = `data:${mediaType};base64,${buf.toString("base64")}`;

  // Create prediction
  const create = await fetch(
    "https://api.replicate.com/v1/models/851-labs/background-remover/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait", // try to wait inline if possible (up to 60s)
      },
      body: JSON.stringify({
        input: { image: dataUrl, format: "png" },
      }),
    },
  );

  if (!create.ok) {
    const err = await create.text();
    throw new Error(`Replicate create failed: ${create.status} ${err}`);
  }

  let prediction = (await create.json()) as {
    id: string;
    status: string;
    output: string | string[] | null;
    error?: string;
    urls?: { get: string };
  };

  // If not done inline, poll for completion (max ~30s for rembg)
  const deadline = Date.now() + 30_000;
  while (
    (prediction.status === "starting" || prediction.status === "processing") &&
    Date.now() < deadline
  ) {
    await new Promise((r) => setTimeout(r, 1000));
    if (!prediction.urls?.get) break;
    const poll = await fetch(prediction.urls.get, {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    prediction = await poll.json();
  }

  if (prediction.status !== "succeeded") {
    throw new Error(
      `Replicate prediction failed: ${prediction.status} ${prediction.error || ""}`,
    );
  }

  const output = prediction.output;
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output[0]) return output[0];
  throw new Error("Replicate returned no output URL");
}

// -----------------------------------------------------------------------------
// Upscale — fal.ai primary (clarity-upscaler) + Replicate fallback (real-esrgan)
// -----------------------------------------------------------------------------

async function falUpscale(file: File, scale: 2 | 4): Promise<string> {
  ensureFal();
  const imageUrl = await fal.storage.upload(file);
  const result = await fal.subscribe("fal-ai/clarity-upscaler", {
    input: { image_url: imageUrl, upscale_factor: scale },
    logs: false,
  });
  const data = result.data as { image?: { url: string } } | undefined;
  if (!data?.image?.url) throw new Error("fal.ai returned no image URL");
  return data.image.url;
}

async function replicateUpscale(file: File, scale: 2 | 4): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN env var is not set");
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const mediaType = file.type || "image/png";
  const dataUrl = `data:${mediaType};base64,${buf.toString("base64")}`;

  const create = await fetch(
    "https://api.replicate.com/v1/models/nightmareai/real-esrgan/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: { image: dataUrl, scale, face_enhance: false },
      }),
    },
  );
  if (!create.ok) {
    throw new Error(`Replicate create failed: ${create.status} ${await create.text()}`);
  }
  let prediction = (await create.json()) as {
    status: string;
    output: string | string[] | null;
    error?: string;
    urls?: { get: string };
  };
  const deadline = Date.now() + 60_000;
  while (
    (prediction.status === "starting" || prediction.status === "processing") &&
    Date.now() < deadline
  ) {
    await new Promise((r) => setTimeout(r, 1500));
    if (!prediction.urls?.get) break;
    const poll = await fetch(prediction.urls.get, {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    prediction = await poll.json();
  }
  if (prediction.status !== "succeeded") {
    throw new Error(`Replicate prediction failed: ${prediction.status} ${prediction.error || ""}`);
  }
  const output = prediction.output;
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output[0]) return output[0];
  throw new Error("Replicate returned no output URL");
}

// -----------------------------------------------------------------------------
// Public API — 2-tier with automatic fallback
// -----------------------------------------------------------------------------

export async function removeBackground(file: File): Promise<{
  resultUrl: string;
  provider: "fal" | "replicate";
}> {
  // Tier 1: fal.ai
  try {
    const url = await falRemoveBackground(file);
    return { resultUrl: url, provider: "fal" };
  } catch (err1) {
    const msg1 = err1 instanceof Error ? err1.message : String(err1);
    console.warn(`[fal] tier1 failed: ${msg1}`);
    // Tier 2: Replicate
    try {
      console.log("[fal] tier2 retry → Replicate");
      const url = await replicateRemoveBackground(file);
      return { resultUrl: url, provider: "replicate" };
    } catch (err2) {
      const msg2 = err2 instanceof Error ? err2.message : String(err2);
      console.error(`[fal] all tiers failed. tier2 error: ${msg2}`);
      throw err1;
    }
  }
}

export async function upscale(
  file: File,
  scale: 2 | 4 = 2,
): Promise<{ resultUrl: string; provider: "fal" | "replicate" }> {
  try {
    const url = await falUpscale(file, scale);
    return { resultUrl: url, provider: "fal" };
  } catch (err1) {
    const msg1 = err1 instanceof Error ? err1.message : String(err1);
    console.warn(`[fal] upscale tier1 failed: ${msg1}`);
    try {
      console.log("[fal] upscale tier2 retry → Replicate");
      const url = await replicateUpscale(file, scale);
      return { resultUrl: url, provider: "replicate" };
    } catch (err2) {
      console.error(`[fal] upscale all tiers failed:`, err2);
      throw err1;
    }
  }
}

// -----------------------------------------------------------------------------
// Generic Replicate prediction runner (for tools without fal.ai alternative)
// -----------------------------------------------------------------------------

async function runReplicate(
  modelPath: string, // e.g. "arielreplicate/deoldify_image"
  input: Record<string, unknown>,
  timeoutMs = 60_000,
): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN env var is not set");
  }
  const create = await fetch(
    `https://api.replicate.com/v1/models/${modelPath}/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({ input }),
    },
  );
  if (!create.ok) {
    throw new Error(
      `Replicate create failed: ${create.status} ${await create.text()}`,
    );
  }
  let prediction = (await create.json()) as {
    status: string;
    output: string | string[] | null;
    error?: string;
    urls?: { get: string };
  };
  const deadline = Date.now() + timeoutMs;
  while (
    (prediction.status === "starting" || prediction.status === "processing") &&
    Date.now() < deadline
  ) {
    await new Promise((r) => setTimeout(r, 1500));
    if (!prediction.urls?.get) break;
    const poll = await fetch(prediction.urls.get, {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    prediction = await poll.json();
  }
  if (prediction.status !== "succeeded") {
    throw new Error(
      `Replicate prediction failed: ${prediction.status} ${prediction.error || ""}`,
    );
  }
  const output = prediction.output;
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output[0]) return output[0];
  throw new Error("Replicate returned no output URL");
}

async function fileToDataUrl(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const mediaType = file.type || "image/png";
  return `data:${mediaType};base64,${buf.toString("base64")}`;
}

// -----------------------------------------------------------------------------
// AI text-to-image — Nano Banana primary (Google Gemini 2.5 Flash Image)
// -----------------------------------------------------------------------------
// Nano Banana is the best-in-class for rendering specific text inside images.
// Fallback to Ideogram v3 (also strong text) on errors.

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

async function falNanoBanana(
  prompt: string,
  aspectRatio: AspectRatio,
): Promise<string> {
  ensureFal();
  const result = await fal.subscribe("fal-ai/nano-banana", {
    input: {
      prompt,
      aspect_ratio: aspectRatio,
      num_images: 1,
    },
    logs: false,
  });
  const data = result.data as
    | { images?: Array<{ url: string }>; image?: { url: string } }
    | undefined;
  const url = data?.images?.[0]?.url || data?.image?.url;
  if (!url) throw new Error("Nano Banana returned no image");
  return url;
}

// Ideogram v3 uses a string enum for image_size, not aspect_ratio
type IdeogramImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9";

function aspectToIdeogramSize(ar: AspectRatio): IdeogramImageSize {
  switch (ar) {
    case "16:9":
      return "landscape_16_9";
    case "9:16":
      return "portrait_16_9";
    case "4:3":
      return "landscape_4_3";
    case "3:4":
      return "portrait_4_3";
    case "1:1":
    default:
      return "square_hd";
  }
}

async function falIdeogram(
  prompt: string,
  aspectRatio: AspectRatio,
): Promise<string> {
  ensureFal();
  const result = await fal.subscribe("fal-ai/ideogram/v3", {
    input: {
      prompt,
      image_size: aspectToIdeogramSize(aspectRatio),
      rendering_speed: "BALANCED",
    },
    logs: false,
  });
  const data = result.data as
    | { images?: Array<{ url: string }>; image?: { url: string } }
    | undefined;
  const url = data?.images?.[0]?.url || data?.image?.url;
  if (!url) throw new Error("Ideogram returned no image");
  return url;
}

export async function aiTextImage(
  prompt: string,
  aspectRatio: AspectRatio = "16:9",
): Promise<{ resultUrl: string; provider: "nano-banana" | "ideogram" }> {
  // Tier 1: Nano Banana (best text rendering, ~$0.039/img)
  try {
    const url = await falNanoBanana(prompt, aspectRatio);
    return { resultUrl: url, provider: "nano-banana" };
  } catch (err1) {
    const msg1 = err1 instanceof Error ? err1.message : String(err1);
    console.warn(`[fal] nano-banana failed: ${msg1}`);
    // Tier 2: Ideogram v3
    try {
      console.log("[fal] tier2 retry → Ideogram v3");
      const url = await falIdeogram(prompt, aspectRatio);
      return { resultUrl: url, provider: "ideogram" };
    } catch (err2) {
      console.error("[fal] aiTextImage all tiers failed:", err2);
      throw err1;
    }
  }
}

// -----------------------------------------------------------------------------
// AI Pet Portrait — image-to-image via Nano Banana Edit
// -----------------------------------------------------------------------------
// Nano Banana (Gemini 2.5 Flash Image) supports image editing with reference
// images via the /edit endpoint. The pet's identity (breed, color, face) is
// preserved while the costume/scene from the prompt is composed around it.
//
// Endpoint: fal-ai/nano-banana/edit
// Input: { prompt, image_urls: string[], num_images?: 1 }
// Output: { images: [{ url }] }

async function falNanoBananaEdit(
  prompt: string,
  imageUrl: string,
): Promise<string> {
  ensureFal();
  const result = await fal.subscribe("fal-ai/nano-banana/edit", {
    input: {
      prompt,
      image_urls: [imageUrl],
      num_images: 1,
    },
    logs: false,
  });
  const data = result.data as
    | { images?: Array<{ url: string }>; image?: { url: string } }
    | undefined;
  const url = data?.images?.[0]?.url || data?.image?.url;
  if (!url) throw new Error("Nano Banana Edit returned no image");
  return url;
}

/**
 * Image-to-image: take a user pet photo + prompt, return transformed image URL.
 * Uses Nano Banana Edit (best for preserving subject identity while composing
 * costumes/scenes around it).
 */
export async function petPortrait(
  file: File,
  prompt: string,
): Promise<{ resultUrl: string; provider: "nano-banana-edit" }> {
  ensureFal();
  // Upload the user's pet photo to fal.storage (temporary CDN)
  const imageUrl = await fal.storage.upload(file);
  const resultUrl = await falNanoBananaEdit(prompt, imageUrl);
  return { resultUrl, provider: "nano-banana-edit" };
}

// -----------------------------------------------------------------------------
// Colorize black-and-white photos — Replicate only (arielreplicate/deoldify)
// -----------------------------------------------------------------------------

export async function colorize(
  file: File,
): Promise<{ resultUrl: string; provider: "replicate" }> {
  const dataUrl = await fileToDataUrl(file);
  const url = await runReplicate(
    "arielreplicate/deoldify_image",
    { input_image: dataUrl, render_factor: 35 },
    90_000,
  );
  return { resultUrl: url, provider: "replicate" };
}

// -----------------------------------------------------------------------------
// Cartoonify photos — Replicate only (catacolabs/cartoonify)
// -----------------------------------------------------------------------------

export async function cartoonize(
  file: File,
): Promise<{ resultUrl: string; provider: "replicate" }> {
  const dataUrl = await fileToDataUrl(file);
  const url = await runReplicate(
    "catacolabs/cartoonify",
    { image: dataUrl },
    90_000,
  );
  return { resultUrl: url, provider: "replicate" };
}
