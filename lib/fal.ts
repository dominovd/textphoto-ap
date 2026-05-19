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
    input: { image_url: imageUrl, scale_factor: scale },
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
