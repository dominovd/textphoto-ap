#!/usr/bin/env node
/**
 * One-off: take 4 demo pairs from ~/Downloads/bg, resize each to 1024×576
 * webp (cover-fit), and upload to /api/showcase-upload with kind=editor-demo.
 *
 * After this runs, lib/AiImageEditorTool.tsx already points DEMO_PAIRS at the
 * resulting Blob URLs.
 *
 * USAGE:
 *   cd textphoto-app
 *   SHOWCASE_SEED_TOKEN=... node scripts/seed-editor-demo.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

const BASE_URL = process.env.TEXTPHOTO_URL || "https://textphoto.app";
const SOURCE_DIR =
  process.env.SOURCE_DIR || path.join(os.homedir(), "Downloads", "bg");
const TOKEN = process.env.SHOWCASE_SEED_TOKEN;

if (!TOKEN) {
  console.error(
    "ERROR: SHOWCASE_SEED_TOKEN env var not set.\n" +
      "Run: SHOWCASE_SEED_TOKEN=<value> node scripts/seed-editor-demo.mjs",
  );
  process.exit(1);
}

// Mapping: source filename → slot id (matches lib/AiImageEditorTool.tsx DEMO_PAIRS)
const MAPPING = [
  {
    file: "u4623431119_astronaut_still_in_soft_suit_helmet_off_relaxed_o_3f4bfa0d-8280-409b-9886-ce5bd7901be1_3.png",
    slot: "bg-before",
  },
  {
    file: "textphoto-edit-1779641362266.png",
    slot: "bg-after",
  },
  {
    file: "u4623431119_Breathe_deeply_focus_on_the_present_and_take_smal_717ed631-ac17-4f03-b6c4-2bd8f34a70bf_0.png",
    slot: "color-before",
  },
  {
    file: "textphoto-edit-1779641547293.png",
    slot: "color-after",
  },
];

console.log(`Source: ${SOURCE_DIR}`);
console.log(`Target: ${BASE_URL}/api/showcase-upload (kind=editor-demo)\n`);

const seeded = [];
const failed = [];

for (let i = 0; i < MAPPING.length; i++) {
  const { file, slot } = MAPPING[i];
  const fullPath = path.join(SOURCE_DIR, file);
  process.stdout.write(`[${i + 1}/${MAPPING.length}] ${slot} ← ${file} … `);

  try {
    const srcBuf = await fs.readFile(fullPath);
    // 1024×576 = 16:9 — matches the slider layout nicely
    const webpBuf = await sharp(srcBuf)
      .resize(1024, 576, { fit: "cover", position: "attention" })
      .webp({ quality: 85 })
      .toBuffer();
    const base64 = webpBuf.toString("base64");

    const res = await fetch(`${BASE_URL}/api/showcase-upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-seed-token": TOKEN,
      },
      body: JSON.stringify({
        kind: "editor-demo",
        styleId: slot,
        base64,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(`✗ ${data.error || res.status}`);
      failed.push({ slot, error: data.error || `HTTP ${res.status}` });
      continue;
    }
    console.log(`✓ ${webpBuf.length}B → ${data.url}`);
    seeded.push({ slot, url: data.url });
  } catch (err) {
    console.log(`✗ ${err.message}`);
    failed.push({ slot, error: err.message });
  }
}

console.log(`\n=== DONE ===`);
console.log(`Seeded: ${seeded.length}/${MAPPING.length}`);
if (failed.length) console.log("Failed:", failed);

console.log("\nVerify the URLs below match these in components/tools/AiImageEditorTool.tsx → DEMO_PAIRS:");
for (const s of seeded) {
  console.log(`  ${s.slot}: ${s.url}`);
}
