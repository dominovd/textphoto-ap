/**
 * Pre-defined style templates for the AI text effect generator.
 * Each style provides a prompt template (with {TEXT} placeholder) and metadata.
 * Adding a new style = adding an entry here. No code changes needed elsewhere.
 */

export type TextEffectStyle = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  defaultText: string;
  // Prompt template. {TEXT} is replaced with the user's input.
  promptTemplate: string;
  // Aspect ratio sent to the model. Defaults to square.
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  // Optional: SEO targeting for use-case landing pages
  seoSlug?: string;
  seoVolume?: number;
};

// Pre-generated showcase URL for each style. Lives in Vercel Blob,
// served via /api/showcase-upload during seeding. Used as preview in
// the style-picker UI so users see what each style looks like before generating.
const BLOB_BASE = "https://0sbqqt82hdpagq0d.public.blob.vercel-storage.com";

export function getStylePreviewUrl(styleId: string): string | null {
  // All seeded styles except twitch-panel (which can be seeded later).
  const seeded = new Set([
    "realistic-fire",
    "blue-flame",
    "heavy-metal",
    "neon-sign",
    "3d-gold",
    "cyberpunk",
    "gaming-banner",
    "horror-cursed",
    "holographic",
    "stone-carving",
    "youtube-thumbnail",
    "minimalist-logo",
  ]);
  return seeded.has(styleId) ? `${BLOB_BASE}/showcase/${styleId}.webp` : null;
}

export const TEXT_EFFECT_STYLES: TextEffectStyle[] = [
  {
    id: "realistic-fire",
    name: "Realistic Fire",
    description: "Real-looking orange flames forming the letters",
    emoji: "🔥",
    defaultText: "BLAZE",
    promptTemplate:
      "Realistic large orange and yellow flames forming the word '{TEXT}' in capital letters, dark black background, cinematic dramatic lighting, fire embers and sparks, photorealistic, 4K detail, intense heat, the letters MUST be clearly readable and exactly spell '{TEXT}'.",
    aspectRatio: "16:9",
    seoSlug: "fire-text-generator",
    seoVolume: 1300,
  },
  {
    id: "blue-flame",
    name: "Blue Flame",
    description: "Electric blue plasma fire typography",
    emoji: "💙",
    defaultText: "IGNITE",
    promptTemplate:
      "Bright electric blue plasma flames spelling '{TEXT}' in bold capital letters, futuristic sci-fi background with technical schematic details, glowing energy, the text MUST clearly read '{TEXT}'.",
    aspectRatio: "16:9",
  },
  {
    id: "heavy-metal",
    name: "Heavy Metal Logo",
    description: "Distressed gothic band-style logo",
    emoji: "🎸",
    defaultText: "INFERNO",
    promptTemplate:
      "Heavy metal band logo for the word '{TEXT}', distressed gothic font with sharp serifs, fire and smoke billowing in the background, concert stage with red lighting, the letters MUST clearly spell '{TEXT}'.",
    aspectRatio: "16:9",
  },
  {
    id: "neon-sign",
    name: "Neon Sign",
    description: "Glowing neon tube sign on brick wall",
    emoji: "💡",
    defaultText: "OPEN",
    promptTemplate:
      "Glowing neon tube sign spelling '{TEXT}' against a dark brick wall, vibrant pink and cyan light, retro 80s diner aesthetic, the neon tubes MUST clearly form the word '{TEXT}'.",
    aspectRatio: "16:9",
    seoSlug: "neon-sign-generator",
    seoVolume: 4400,
  },
  {
    id: "3d-gold",
    name: "3D Gold Luxury",
    description: "Premium 3D gold metallic text",
    emoji: "🏆",
    defaultText: "VICTORY",
    promptTemplate:
      "Luxurious 3D rendered gold metallic text spelling '{TEXT}', polished reflective surface with realistic highlights, black marble or velvet background, premium product packaging design, the gold letters MUST clearly spell '{TEXT}'.",
    aspectRatio: "16:9",
    seoSlug: "3d-text-generator",
    seoVolume: 6600,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Glitch",
    description: "Holographic glitched text, neon city",
    emoji: "🌃",
    defaultText: "SYSTEM",
    promptTemplate:
      "Cyberpunk style holographic glitched text '{TEXT}' with chromatic aberration, magenta and cyan colors, futuristic dark city skyline background with neon signs, the glitched letters MUST clearly read '{TEXT}'.",
    aspectRatio: "16:9",
  },
  {
    id: "gaming-banner",
    name: "Gaming Banner",
    description: "Esports tournament-style banner",
    emoji: "🎮",
    defaultText: "WINNER",
    promptTemplate:
      "Bold esports gaming banner with the text '{TEXT}' in capital letters, explosive sparks and fire effects, dramatic stage lighting, dark blue and orange color scheme, tournament backdrop, the text MUST clearly read '{TEXT}'.",
    aspectRatio: "16:9",
    seoSlug: "discord-banner-text",
    seoVolume: 1600,
  },
  {
    id: "horror-cursed",
    name: "Horror Cursed",
    description: "Dripping blood, spooky atmosphere",
    emoji: "💀",
    defaultText: "CURSED",
    promptTemplate:
      "Cursed horror movie title '{TEXT}' in capital letters, with dripping red liquid texture, dark spooky atmosphere, fog and dim red lighting, found-footage aesthetic, the letters MUST clearly spell '{TEXT}'.",
    aspectRatio: "16:9",
  },
  {
    id: "holographic",
    name: "Holographic Chrome",
    description: "Iridescent shimmer rainbow chrome",
    emoji: "✨",
    defaultText: "AURA",
    promptTemplate:
      "Iridescent holographic chrome 3D text spelling '{TEXT}' in modern sans-serif, rainbow shimmer reflections, soft white studio background, sleek minimal design, the letters MUST clearly spell '{TEXT}'.",
    aspectRatio: "16:9",
  },
  {
    id: "stone-carving",
    name: "Ancient Stone Carving",
    description: "Weathered marble, classical aesthetic",
    emoji: "🏛️",
    defaultText: "LEGEND",
    promptTemplate:
      "Ancient stone carving spelling '{TEXT}' chiseled into weathered marble, classical Greek temple aesthetic with dramatic shadows in the engraved letters, archaeological dig aesthetic, the carved letters MUST clearly spell '{TEXT}'.",
    aspectRatio: "16:9",
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    description: "Bold high-CTR thumbnail text",
    emoji: "▶️",
    defaultText: "INSANE",
    promptTemplate:
      "Bold YouTube thumbnail style text '{TEXT}' in large capital letters with thick yellow outline and red drop shadow, exciting and click-bait aesthetic, white background highlights, the text MUST clearly read '{TEXT}' and be the focal point.",
    aspectRatio: "16:9",
    seoSlug: "youtube-thumbnail-text",
    seoVolume: 5400,
  },
  {
    id: "minimalist-logo",
    name: "Minimalist Logo",
    description: "Clean modern brand logotype",
    emoji: "⚪",
    defaultText: "BRAND",
    promptTemplate:
      "Minimalist modern logo wordmark for '{TEXT}', clean sans-serif typography, single accent color, lots of negative space, premium brand identity design, the logotype MUST clearly spell '{TEXT}'.",
    aspectRatio: "1:1",
    seoSlug: "logo-text-generator",
    seoVolume: 8100,
  },
  {
    id: "twitch-panel",
    name: "Twitch Panel",
    description: "Streamer panel header aesthetic",
    emoji: "🎮",
    defaultText: "ABOUT",
    promptTemplate:
      "Twitch streamer panel header with the text '{TEXT}' in stylized gaming typography, purple and black color scheme, glowing accents, modern esports aesthetic, the text MUST clearly read '{TEXT}'.",
    aspectRatio: "16:9",
    seoSlug: "twitch-panel-text",
    seoVolume: 880,
  },
];

export function getStyle(id: string): TextEffectStyle | undefined {
  return TEXT_EFFECT_STYLES.find((s) => s.id === id);
}

export function getStylesWithSeoSlug(): TextEffectStyle[] {
  return TEXT_EFFECT_STYLES.filter((s) => s.seoSlug);
}

/** Build the final prompt for the AI model. */
export function buildPrompt(style: TextEffectStyle, userText: string): string {
  const cleaned = userText.trim().slice(0, 32);
  return style.promptTemplate.replaceAll("{TEXT}", cleaned);
}
