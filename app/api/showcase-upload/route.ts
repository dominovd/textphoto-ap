import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getStyle } from "@/lib/text-effect-styles";
import { getPetStyle } from "@/lib/pet-portrait-styles";

export const runtime = "nodejs";
export const maxDuration = 30;

type Kind = "text-effect" | "pet-portrait";

function validateStyle(kind: Kind, styleId: string): boolean {
  if (kind === "pet-portrait") return !!getPetStyle(styleId);
  return !!getStyle(styleId);
}

function blobPathFor(kind: Kind, styleId: string): string {
  if (kind === "pet-portrait") return `pet-showcase/${styleId}.webp`;
  return `showcase/${styleId}.webp`;
}

/**
 * Internal showcase uploader.
 *
 * Accepts pre-encoded WebP base64 from the browser (after we've run the
 * Nano Banana generation + canvas resize there) and dumps to Blob at a
 * deterministic path. Used ONLY for seeding the homepage carousel — not a
 * public API. Gated by a shared secret.
 */
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob not configured" },
      { status: 503 },
    );
  }
  const expected = process.env.SHOWCASE_SEED_TOKEN;
  if (expected) {
    const got = req.headers.get("x-seed-token");
    if (got !== expected) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else {
    // Belt-and-suspenders: refuse if not running in development AND no token set.
    // Once you're done seeding, remove the env var to disable the endpoint.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "SHOWCASE_SEED_TOKEN must be set in production" },
        { status: 403 },
      );
    }
  }

  try {
    const body = await req.json().catch(() => ({}));
    const styleId = String(body.styleId || "");
    const base64 = String(body.base64 || "");
    const kindRaw = String(body.kind || "text-effect");
    const kind: Kind = kindRaw === "pet-portrait" ? "pet-portrait" : "text-effect";
    if (!styleId || !base64) {
      return NextResponse.json(
        { error: "styleId and base64 required" },
        { status: 400 },
      );
    }
    if (!validateStyle(kind, styleId)) {
      return NextResponse.json(
        { error: `Unknown style for kind=${kind}` },
        { status: 400 },
      );
    }

    const buf = Buffer.from(base64, "base64");
    if (buf.byteLength === 0 || buf.byteLength > 1_000_000) {
      return NextResponse.json(
        { error: "Bad payload size" },
        { status: 400 },
      );
    }

    const blob = await put(blobPathFor(kind, styleId), buf, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000,
    });

    return NextResponse.json({
      styleId,
      kind,
      url: blob.url,
      bytes: buf.byteLength,
    });
  } catch (err) {
    console.error("/api/showcase-upload error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
