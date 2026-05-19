export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string; // tailwind gradient classes
  count: number;
};

export const categories: Category[] = [
  {
    slug: "captions",
    name: "Captions",
    description: "Instagram, TikTok, travel, food, wedding…",
    icon: "💬",
    gradient: "from-pink-500 to-rose-500",
    count: 11,
  },
  {
    slug: "ocr",
    name: "OCR / Photo to Text",
    description: "Image to text, handwriting, translate from photo",
    icon: "🔠",
    gradient: "from-cyan-500 to-blue-600",
    count: 8,
  },
  {
    slug: "effects",
    name: "CSS text effects",
    description: "Fire, neon, bubble, graffiti, 3D, glitch — instant, no AI",
    icon: "✨",
    gradient: "from-orange-500 to-red-500",
    count: 6,
  },
  {
    slug: "text-art",
    name: "AI text art",
    description:
      "Type a word, get a cinematic image — neon signs, gold logos, fire banners",
    icon: "🎨",
    gradient: "from-fuchsia-500 to-amber-500",
    count: 8,
  },
  {
    slug: "memes",
    name: "Meme makers",
    description: "Drake, distracted boyfriend, custom captions",
    icon: "😂",
    gradient: "from-amber-500 to-yellow-500",
    count: 6,
  },
  {
    slug: "alt-text",
    name: "Alt-text & SEO",
    description: "AI alt text, image description, SEO filenames",
    icon: "♿",
    gradient: "from-emerald-500 to-teal-500",
    count: 3,
  },
  {
    slug: "enhance",
    name: "Photo enhancement",
    description: "Cartoonize, colorize, restore, sketch",
    icon: "🖼️",
    gradient: "from-purple-500 to-fuchsia-500",
    count: 10,
  },
  {
    slug: "prompts",
    name: "AI art prompts",
    description: "Midjourney, SD, image-to-prompt",
    icon: "🎨",
    gradient: "from-indigo-500 to-violet-600",
    count: 4,
  },
  {
    slug: "utilities",
    name: "Image utilities",
    description: "JPG↔PNG, resize, crop, base64, mirror",
    icon: "🛠️",
    gradient: "from-slate-700 to-slate-900",
    count: 8,
  },
  {
    slug: "games",
    name: "Drawing & games",
    description: "Pictionary, charades, drawing prompts",
    icon: "✏️",
    gradient: "from-lime-500 to-emerald-500",
    count: 4,
  },
  {
    slug: "stickers",
    name: "Stickers & PFP",
    description: "Profile pics, Discord avatars, sticker maker",
    icon: "🎭",
    gradient: "from-pink-400 to-purple-500",
    count: 4,
  },
  {
    slug: "identify",
    name: "Identify from photo",
    description: "Plants, animals, fonts, objects",
    icon: "🔍",
    gradient: "from-blue-500 to-indigo-600",
    count: 5,
  },
  {
    slug: "names",
    name: "Photo-themed names",
    description: "Photographer brand, IG handle, scrapbook",
    icon: "📸",
    gradient: "from-rose-500 to-pink-600",
    count: 4,
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
