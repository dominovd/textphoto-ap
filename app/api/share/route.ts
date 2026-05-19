import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { newShareId, saveShare } from "@/lib/share-store";
import { getStyle } from "@/lib/text-effect-styles";
import { addWatermark } from "@/lib/watermark";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Share is not configured (BLOB_READ_WRITE_TOKEN missing). Enable Vercel Blob in project settings.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const imageUrl = String(body.imageUrl || "").trim();
    const text = String(body.text || "").trim().slice(0, 32);
    const styleId = String(body.styleId || "").trim();

    if (!imageUrl || !text || !styleId) {
      return NextResponse.json(
        { error: "imageUrl, text, and styleId are required" },
        { status: 400 },
      );
    }
    if (!getStyle(styleId)) {
      return NextResponse.json({ error: "Unknown styleId" }, { status: 400 });
    }
    // Only allow trusted upstream image hosts (fal.ai CDN)
    if (
      !/^https:\/\/[a-z0-9-]+\.fal\.(media|run)\//i.test(imageUrl) &&
      !/^https:\/\/fal\.media\//i.test(imageUrl)
    ) {
      return NextResponse.json(
        { error: "imageUrl must be a fal.ai-hosted URL" },
        { status: 400 },
      );
    }

    // Download from fal CDN
    const upstream = await fetch(imageUrl);
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Failed to fetch source image: ${upstream.status}` },
        { status: 502 },
      );
    }
    const buf = await upstream.arrayBuffer();
    if (buf.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Source image too large" },
        { status: 413 },
      );
    }

    // Add textphoto.app watermark — every shared image carries the brand back
    let finalBuffer: Buffer;
    try {
      finalBuffer = await addWatermark(Buffer.from(buf));
    } catch (e) {
      // If watermark fails (rare — e.g. unsupported format), upload original
      console.warn("watermark failed, uploading original:", e);
      finalBuffer = Buffer.from(buf);
    }

    // Upload to Vercel Blob with predictable path
    const id = newShareId();
    const blob = await put(`share/${id}.png`, finalBuffer, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
    });

    // Persist metadata in Upstash
    await saveShare(id, {
      url: blob.url,
      text,
      styleId,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      id,
      shareUrl: `https://textphoto.app/s/${id}`,
      blobUrl: blob.url,
    });
  } catch (err) {
    console.error("/api/share error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
