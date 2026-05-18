export type Tool = {
  slug: string;
  category: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  searchVolume: number;
  // Component dispatcher key. The dispatcher in app/[category]/[tool]/page.tsx
  // maps these to React components. "text-effect" + "photo-caption" use generic
  // components keyed by the tool slug.
  component:
    | "photo-caption"
    | "ocr"
    | "text-effect"
    | "alt-text"
    | "meme"
    | null;
  faq: { q: string; a: string }[];
  featured?: boolean;
};

export const tools: Tool[] = [
  // === CAPTIONS ===
  {
    slug: "instagram-caption-generator",
    category: "captions",
    name: "Instagram Caption Generator",
    shortDescription: "Drop a photo → 10 caption ideas with hashtags.",
    longDescription:
      "Our AI looks at what's actually in your photo — the subject, the colours, the mood — and writes captions that fit the moment. Pick a vibe (aesthetic, funny, romantic, savage) and the model adjusts tone, length, and hashtag relevance accordingly.",
    icon: "📷",
    searchVolume: 8100,
    component: "photo-caption",
    featured: true,
    faq: [
      {
        q: "Is this completely free?",
        a: "Yes. No sign up, no credit card. Soft daily limit for abuse prevention.",
      },
      {
        q: "Will my photo be stored or used to train AI?",
        a: "No. Photos are processed and deleted from our servers within 24 hours. Never used for training.",
      },
      {
        q: "Can I use the captions commercially?",
        a: "Yes — for personal posts, brand pages, client work, anywhere.",
      },
      {
        q: "What's the max photo size?",
        a: "10 MB. We auto-compress before sending to the model.",
      },
    ],
  },
  {
    slug: "tiktok-caption-generator",
    category: "captions",
    name: "TikTok Caption Generator",
    shortDescription: "Hooks + hashtags optimised for the For You page.",
    longDescription:
      "Generate TikTok captions designed for the For You algorithm — short hooks under 100 chars, trending hashtags like #fyp #foryou, emoji placement that boosts engagement.",
    icon: "🎵",
    searchVolume: 720,
    component: "photo-caption",
    faq: [
      { q: "Is it free?", a: "Yes, completely free." },
      {
        q: "Does it suggest trending hashtags?",
        a: "Yes — #fyp #foryou #viral are always included, plus topic-specific ones based on your photo.",
      },
      {
        q: "How long should TikTok captions be?",
        a: "Short — under 100 chars. The hook is in the first 3 words.",
      },
    ],
  },
  {
    slug: "ai-photo-caption-generator",
    category: "captions",
    name: "AI Photo Caption Generator",
    shortDescription: "Universal caption AI — works for any platform.",
    longDescription:
      "Universal AI caption generator. Works for any photo: products, food, travel, portraits. Pick a vibe and get 10 captions that fit Instagram, Facebook, X, or anywhere else.",
    icon: "🖼️",
    searchVolume: 2400,
    component: "photo-caption",
    faq: [
      {
        q: "Which platforms does it support?",
        a: "Output is platform-agnostic — works for Instagram, Facebook, LinkedIn, Pinterest, Twitter/X. For platform-specific tone, use our Instagram or TikTok caption generators.",
      },
    ],
  },
  {
    slug: "instagram-bio-generator",
    category: "captions",
    name: "Instagram Bio Generator",
    shortDescription: "Bio ideas in 3 styles: aesthetic, funny, pro.",
    longDescription:
      "Generate Instagram bio ideas fitting your niche. Add your keywords, pick a vibe, get 10 bios fitting the 150-char limit.",
    icon: "👤",
    searchVolume: 5400,
    component: null,
    faq: [{ q: "Does it include emojis?", a: "Yes, optional." }],
  },

  // === OCR ===
  {
    slug: "image-to-text",
    category: "ocr",
    name: "Image to Text (OCR online)",
    shortDescription:
      "Extract text from any image — receipts, screenshots, handwriting, scanned docs.",
    longDescription:
      "Drop any image and get the text inside it — instantly. Works on receipts, screenshots, scanned documents, even handwritten notes. Supports 30+ languages.",
    icon: "🔤",
    searchVolume: 22000,
    component: "ocr",
    featured: true,
    faq: [
      {
        q: "What file formats are supported?",
        a: "PNG, JPG, JPEG, WEBP, GIF. Max 10 MB.",
      },
      {
        q: "Does it work with handwriting?",
        a: "Yes — accuracy is best with clear, dark-on-light handwriting.",
      },
      {
        q: "Is my image stored?",
        a: "No. Images are deleted from our servers immediately after processing.",
      },
      {
        q: "Which languages are supported?",
        a: "30+ languages including English, Spanish, French, German, Russian, Chinese, Japanese, Korean, Arabic.",
      },
    ],
  },
  {
    slug: "handwriting-to-text",
    category: "ocr",
    name: "Handwriting to Text",
    shortDescription: "Turn handwritten notes into editable text.",
    longDescription:
      "AI handwriting recognition. Upload a photo of handwritten notes or letters and get editable digital text.",
    icon: "✍️",
    searchVolume: 4400,
    component: null,
    faq: [
      {
        q: "How accurate is it?",
        a: "85-95% for clear handwriting, lower for cursive or messy writing.",
      },
    ],
  },
  {
    slug: "translate-from-photo",
    category: "ocr",
    name: "Translate Text from Photo",
    shortDescription: "Extract + translate text from any image.",
    longDescription:
      "Two steps in one — OCR + translation. Useful for menus, signs, documents in a foreign language.",
    icon: "🌐",
    searchVolume: 9900,
    component: null,
    faq: [{ q: "How many languages?", a: "30+ for OCR, 100+ for translation." }],
  },

  // === EFFECTS (all using generic TextEffectTool via lib/effects.ts) ===
  {
    slug: "neon",
    category: "effects",
    name: "Neon Text Generator",
    shortDescription:
      "Glowing neon letters for posters, social media, Twitch overlays.",
    longDescription:
      "Type your text, pick a color, get a glowing neon image — perfect for posters, Twitch overlays, video thumbnails. Export as transparent PNG.",
    icon: "💡",
    searchVolume: 9900,
    component: "text-effect",
    featured: true,
    faq: [
      {
        q: "Can I change the color?",
        a: "Yes — 6 preset colors.",
      },
      {
        q: "How do I save it?",
        a: "Click Download as PNG — exports at 2x resolution. Use 'Transparent' background for overlays.",
      },
    ],
  },
  {
    slug: "fire",
    category: "effects",
    name: "Fire Text Generator",
    shortDescription: "Turn any text into a fiery image.",
    longDescription:
      "Classic fire text with flames around your letters — orange, red, and yellow gradient. Or pick from blue flame, inferno, or toxic green variants. Export as PNG.",
    icon: "🔥",
    searchVolume: 1300,
    component: "text-effect",
    faq: [
      {
        q: "How many fire styles are there?",
        a: "4: Classic, Inferno, Blue flame, Toxic.",
      },
    ],
  },
  {
    slug: "bubble",
    category: "effects",
    name: "Bubble Letter Generator",
    shortDescription:
      "Classic bubble writing — ready for stickers and prints.",
    longDescription:
      "Bubble letter style with bold outlines and offset shadows. Great for stickers, t-shirts, posters. 5 color schemes, downloads as PNG.",
    icon: "🫧",
    searchVolume: 5400,
    component: "text-effect",
    faq: [
      { q: "Can I customize colors?", a: "Yes — pick from 5 color schemes." },
    ],
  },
  {
    slug: "cursive",
    category: "effects",
    name: "Cursive Text Generator",
    shortDescription: "Elegant cursive text in 5 colors, ready to save.",
    longDescription:
      "Beautiful cursive script in classic black, rose, royal purple, forest green, or gold ink. Use it for cards, posters, social media graphics.",
    icon: "✒️",
    searchVolume: 14800,
    component: "text-effect",
    faq: [
      {
        q: "Does it work in social media bios?",
        a: "This generator outputs styled images. For Unicode bio fonts, see our Unicode font tool (coming soon).",
      },
    ],
  },
  {
    slug: "glitch",
    category: "effects",
    name: "Glitch Text Generator",
    shortDescription: "Cyberpunk RGB-split text effect — 4 styles.",
    longDescription:
      "The iconic RGB-split glitch effect. Pick from Classic, Strong, Subtle, or Vapor styles. Perfect for music covers, gaming thumbnails, edgy social posts.",
    icon: "📡",
    searchVolume: 14800,
    component: "text-effect",
    faq: [
      {
        q: "What is the glitch effect?",
        a: "It's the chromatic aberration look — red and cyan copies of the text offset slightly, like a TV signal interference.",
      },
    ],
  },
  {
    slug: "gold",
    category: "effects",
    name: "Gold Text Generator",
    shortDescription:
      "Shiny gold text — classic, rose gold, white gold, bronze.",
    longDescription:
      "Luxurious gold letter effect with metallic gradient and glow. 4 finishes: Classic gold, Rose gold, White gold, Bronze. Great for luxury branding, certificates, premium designs.",
    icon: "🏆",
    searchVolume: 880,
    component: "text-effect",
    faq: [
      {
        q: "What finishes are available?",
        a: "Classic, Rose gold, White gold, Bronze.",
      },
    ],
  },

  // === ALT-TEXT ===
  {
    slug: "alt-text-generator",
    category: "alt-text",
    name: "AI Alt Text Generator",
    shortDescription:
      "Generate SEO-friendly alt text for any image in 1 click.",
    longDescription:
      "Drop an image, get 3 alt text variants in seconds — short for SEO, medium for general use, detailed for complex images. Helps with both screen readers and SEO.",
    icon: "♿",
    searchVolume: 1300,
    component: "alt-text",
    featured: true,
    faq: [
      {
        q: "Why 3 variants?",
        a: "Different contexts need different lengths. Short (<80 chars) is best for SEO/quick screen readers; medium (80-125) is the recommended default; detailed (125-200) is for complex images.",
      },
      {
        q: "Is the alt text SEO-optimized?",
        a: "Yes — concrete, descriptive, never starts with 'image of', includes key visual elements.",
      },
      {
        q: "Can I bulk-process?",
        a: "Single images only on the free tier; bulk API coming soon.",
      },
    ],
  },

  // === MEMES ===
  {
    slug: "ai-meme-generator",
    category: "memes",
    name: "AI Meme Generator",
    shortDescription: "Upload a photo, get 5 viral meme captions for it.",
    longDescription:
      "AI looks at your photo and writes 5 meme-worthy captions in the style of your choice — relatable, savage, wholesome, Gen-Z, or a mix.",
    icon: "😂",
    searchVolume: 27000,
    component: "meme",
    faq: [
      {
        q: "Does it understand context?",
        a: "Yes — it sees what's in your image and writes captions tailored to it.",
      },
      {
        q: "What styles can I pick?",
        a: "Mixed, Relatable ('when you...'), Savage, Wholesome, Gen Z.",
      },
    ],
  },
];

export function getTool(category: string, slug: string): Tool | undefined {
  return tools.find((t) => t.category === category && t.slug === slug);
}

export function getToolsInCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((t) => t.featured);
}

// Map caption slug → platform for the dispatcher
export function getCaptionPlatform(
  slug: string,
): "instagram" | "tiktok" | "universal" {
  if (slug.includes("tiktok")) return "tiktok";
  if (slug.includes("instagram")) return "instagram";
  return "universal";
}
