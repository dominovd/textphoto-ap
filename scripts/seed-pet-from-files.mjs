#!/usr/bin/env node
/**
 * One-off seeding script: take the 12 pre-generated pet portraits from
 * ~/Downloads/pet, resize each to 600×340 webp (cover-fit), and upload to
 * /api/showcase-upload on production.
 *
 * Run locally — sandbox can't reach textphoto.app.
 *
 * USAGE:
 *   cd textphoto-app
 *   SHOWCASE_SEED_TOKEN=... node scripts/seed-pet-from-files.mjs
 *
 * After it finishes, copy the printed `seeded` array into
 * lib/pet-portrait-styles.ts → getPetStylePreviewUrl seeded set.
 */
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

const BASE_URL = process.env.TEXTPHOTO_URL || "https://textphoto.app";
const SOURCE_DIR =
  process.env.SOURCE_DIR || path.join(os.homedir(), "Downloads", "pet");
const TOKEN = process.env.SHOWCASE_SEED_TOKEN;

if (!TOKEN) {
  console.error(
    "ERROR: SHOWCASE_SEED_TOKEN env var not set.\n" +
      "Run: SHOWCASE_SEED_TOKEN=<value> node scripts/seed-pet-from-files.mjs",
  );
  process.exit(1);
}

// Mapping derived from visual identification.
// Filename → styleId (must match lib/pet-portrait-styles.ts).
const MAPPING = [
  { file: "textphoto-pet-gym-athlete-1779614708756.png", styleId: "gym-athlete" },
  { file: "ktcHU9TioP38z8AODR8Pz_lsbbEfV2.png", styleId: "mafia-boss" },
  { file: "KqFT59GQZrI0gmOqq7UWz_N2tJ27Jw.png", styleId: "chef" },
  { file: "oU6p-_EaqHFJcG4o-jHuj_4gfu90Xy.png", styleId: "astronaut" },
  { file: "GRabBqrU_OXdSfYPUqnAO_anuksYSA.png", styleId: "doctor" },
  { file: "fY76f5PKHYGmc_jkOWiKb_hiiuvV97.png", styleId: "medieval-knight" },
  { file: "wgFxTAR_jXYIa0MmmH0Ne_Ii7EgQLb.png", styleId: "renaissance-painting" },
  { file: "JJI_W5lg32d2WST5P0LV0_pwYetu4C.png", styleId: "superhero" },
  { file: "a0Xe-F570xY7--SdP-Di__BCvbA9oQ.png", styleId: "samurai" },
  { file: "9zI_8JPLWXHhqlg__ipEM_B6LbMIu7.png", styleId: "business-ceo" },
  { file: "3Ff5SBf3UQPB6zhQ6BQrE_yBmy1E9K.png", styleId: "rockstar" },
  { file: "Wz6WnA9iCVc5lLR5oSnge_vG30j4RH.png", styleId: "wizard" },
];

const seeded = [];
const failed = [];

console.log(`Source: ${SOURCE_DIR}`);
console.log(`Target: ${BASE_URL}/api/showcase-upload`);
console.log(`Pieces: ${MAPPING.length}\n`);

for (let i = 0; i < MAPPING.length; i++) {
  const { file, styleId } = MAPPING[i];
  const fullPath = path.join(SOURCE_DIR, file);
  process.stdout.write(`[${i + 1}/${MAPPING.length}] ${styleId} ← ${file} … `);

  try {
    // Read source PNG
    const srcBuf = await fs.readFile(fullPath);

    // Resize to 600x340 cover-fit, encode as webp
    const webpBuf = await sharp(srcBuf)
      .resize(600, 340, { fit: "cover", position: "attention" })
      .webp({ quality: 85 })
      .toBuffer();

    const base64 = webpBuf.toString("base64");

    // Upload
    const res = await fetch(`${BASE_URL}/api/showcase-upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-seed-token": TOKEN,
      },
      body: JSON.stringify({
        kind: "pet-portrait",
        styleId,
        base64,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(`✗ ${data.error || res.status}`);
      failed.push({ styleId, error: data.error || `HTTP ${res.status}` });
      continue;
    }
    console.log(`✓ ${webpBuf.length}B → ${data.url}`);
    seeded.push(styleId);
  } catch (err) {
    console.log(`✗ ${err.message}`);
    failed.push({ styleId, error: err.message });
  }
}

console.log(`\n=== DONE ===`);
console.log(`Seeded: ${seeded.length}/${MAPPING.length}`);
if (failed.length) {
  console.log(`Failed:`, failed);
}
console.log(
  `\nPaste this into lib/pet-portrait-styles.ts → getPetStylePreviewUrl seeded set:`,
);
console.log(JSON.stringify(seeded, null, 2));
