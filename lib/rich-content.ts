/**
 * Long-form SEO content for premium tool landing pages — mirrors the structure
 * that high-performing competitor pages (Pixelbin, Canva tools, etc.) use.
 *
 * Sections rendered by components/RichToolContent.tsx:
 *   - gallery     — 4-8 real example images from our existing Blob assets
 *   - howItWorks  — 3 numbered process steps
 *   - whyUse      — 6 feature cards (icon + title + 1-line desc)
 *   - useCases    — 5-8 numbered scenarios with example prompts
 *   - proTips     — bulleted writing-better-prompts tips
 *   - cta         — bottom banner
 *
 * Add new entries here as we polish more tool pages. Slug must match Tool.slug.
 */

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type Step = {
  title: string;
  description: string;
  emoji: string;
};

export type Feature = {
  title: string;
  description: string;
  emoji: string;
};

export type UseCase = {
  title: string;
  description: string;
  examplePrompt?: string;
};

export type RichContent = {
  // Optional hero subtitle shown under H1 (overrides the default shortDescription).
  heroSubtitle?: string;
  // Pre-generated examples (sourced from our existing Blob carousels).
  gallery?: {
    title: string;
    subtitle?: string;
    items: GalleryItem[];
  };
  howItWorks: {
    title: string;
    steps: [Step, Step, Step];
  };
  whyUse: {
    title: string;
    features: Feature[];
  };
  useCases: {
    title: string;
    items: UseCase[];
  };
  proTips: {
    title: string;
    tips: string[]; // can contain `**bold**` for inline emphasis
  };
  cta: {
    headline: string;
    subline: string;
    buttonLabel?: string;
  };
};

const BLOB_BASE = "https://0sbqqt82hdpagq0d.public.blob.vercel-storage.com";

// =============================================================================
// AI IMAGE EDITOR (enhance/ai-image-editor)
// =============================================================================
const aiImageEditor: RichContent = {
  heroSubtitle:
    "Edit any photo with a simple text prompt. Change backgrounds, swap colours, remove objects, add details — powered by Google's Nano Banana model. Free, no signup, no watermark.",
  // No `gallery` block — the before/after slider inside the tool itself already
  // showcases real edits; a separate gallery would duplicate that content.
  howItWorks: {
    title: "How to edit images with AI in 3 steps",
    steps: [
      {
        emoji: "📤",
        title: "Upload your image",
        description:
          "Drop a JPG, PNG or WEBP file up to 10 MB. Higher resolution input gives sharper output — most modern phone photos work perfectly.",
      },
      {
        emoji: "✍️",
        title: "Describe the change",
        description:
          'Write what you want in plain English: "change background to snowy mountains", "make the shirt red", "remove the trash can". Pick an aspect ratio if needed.',
      },
      {
        emoji: "⬇️",
        title: "Download the result",
        description:
          "Generation takes 8-20 seconds. Drag the before/after slider to compare, then download a watermark-free PNG.",
      },
    ],
  },
  whyUse: {
    title: "Why use our free AI image editor",
    features: [
      {
        emoji: "🤖",
        title: "Powered by Nano Banana",
        description:
          "Google's Gemini 2.5 Flash Image — currently the best image-edit model for preserving the original subject while transforming everything else.",
      },
      {
        emoji: "💬",
        title: "Plain-English editing",
        description:
          "No layers, no masks, no Photoshop skills required. Describe what you want and the AI handles selection and blending.",
      },
      {
        emoji: "↔️",
        title: "Before / after slider",
        description:
          "Compare the edit and the original side-by-side with a draggable handle — see exactly what changed at a glance.",
      },
      {
        emoji: "📐",
        title: "5 aspect ratios",
        description:
          "Keep the original proportions or re-target to 1:1, 16:9, 9:16, 4:3, or 3:4 for social platforms — Instagram, TikTok, YouTube thumbnails.",
      },
      {
        emoji: "🆓",
        title: "Free, no signup",
        description:
          "No account, no credit card, no watermark on the output. 1 edit per hour and 3 per day per user keeps the tool free for everyone.",
      },
      {
        emoji: "🔒",
        title: "Privacy-first",
        description:
          "Your uploaded photo is processed once and deleted from our servers shortly after. We never use your images for training.",
      },
    ],
  },
  useCases: {
    title: "What you can do with the AI image editor",
    items: [
      {
        title: "Swap backgrounds for product photos",
        description:
          "Take a phone shot and drop in a studio backdrop, lifestyle scene, or solid colour — perfect for ecommerce listings without hiring a photographer.",
        examplePrompt:
          "Replace the background with a clean white studio backdrop, soft shadow under the product.",
      },
      {
        title: "Change clothing colours",
        description:
          "Try a different colour palette on a shirt, jacket, or shoes before you commit to a design. Useful for fashion designers and online sellers.",
        examplePrompt:
          "Change the t-shirt colour to deep emerald green, preserve fabric texture and lighting.",
      },
      {
        title: "Remove distracting objects",
        description:
          "Get rid of photobombing tourists, garbage cans, traffic cones, or random clutter. The AI fills the gap with surrounding scenery naturally.",
        examplePrompt:
          "Remove the trash can on the left side, fill the space with the same brick wall.",
      },
      {
        title: "Build holiday cards & profile pics",
        description:
          "Add hats, sunglasses, snow, festive backgrounds, or seasonal effects to any portrait. Great for end-of-year cards and themed avatars.",
        examplePrompt:
          "Add a red Santa hat on the person's head, snowflakes falling in the background.",
      },
      {
        title: "Real estate decluttering",
        description:
          "Empty rooms of personal items before listing — remove magnets from the fridge, clear the kitchen counter, take down family photos.",
        examplePrompt:
          "Remove all personal items from the kitchen counter, keep the counter clean and empty.",
      },
      {
        title: "Style transfer",
        description:
          "Convert any photo to a pencil sketch, watercolour, oil painting, anime style, or low-poly render. Same subject, completely different look.",
        examplePrompt:
          "Convert the entire image to a hand-drawn pencil sketch with cross-hatching on white paper.",
      },
      {
        title: "Add accessories to portraits",
        description:
          "Try on sunglasses, hats, earrings, makeup, or hairstyles without leaving your couch. Useful for ecommerce previews and creative experiments.",
        examplePrompt:
          "Add stylish black aviator sunglasses to the person, with realistic reflections in the lenses.",
      },
    ],
  },
  proTips: {
    title: "How to write prompts that actually work",
    tips: [
      "**Be specific about what to change.** 'Change the car to deep emerald green with metallic finish' beats 'green car'. Name the object, the new colour, and the texture.",
      "**One or two edits per prompt.** Asking for 'change background AND add a hat AND remove glasses' in one go usually fails. Do edits in sequence — edit, download, re-upload, edit again.",
      "**Mention what to preserve.** 'Replace background with beach, keep the person's face, hair, and pose untouched' is far more reliable than 'put me on a beach'.",
      "**Use specific style words.** 'Photorealistic', 'oil painting', 'anime style', 'cinematic lighting', 'soft golden hour' — these all bias the model in useful directions.",
      "**Set the aspect ratio for social.** Pick 9:16 for TikTok/Reels, 16:9 for YouTube thumbnails, 1:1 for Instagram feed posts. The AI will recompose the scene to fit.",
      "**Iterate fast — don't expect one-shot perfection.** Re-prompt with small tweaks (' but more vibrant', '...slightly warmer lighting'). Most professional edits take 3-5 iterations.",
    ],
  },
  cta: {
    headline: "Edit any image with a single prompt",
    subline: "Free AI image editor — no signup, no watermark, no software install.",
    buttonLabel: "Start editing →",
  },
};

// =============================================================================
// AI TEXT EFFECT GENERATOR (text-art/ai-text-effect)
// =============================================================================
const aiTextEffect: RichContent = {
  heroSubtitle:
    "Type a word, pick a style, get a cinematic image — fire flames, neon signs on a brick wall, premium gold logos, cyberpunk glitches, and 9 more. Powered by Google's Nano Banana model.",
  gallery: {
    title: "Real generations from the AI text effect tool",
    subtitle: "Click any style on the tool above to remix with your own word",
    items: [
      {
        src: `${BLOB_BASE}/showcase/realistic-fire.webp`,
        alt: "The word BLAZE in realistic orange flames",
        caption: "Realistic Fire — 'BLAZE'",
      },
      {
        src: `${BLOB_BASE}/showcase/neon-sign.webp`,
        alt: "The word OPEN as a glowing neon sign on a brick wall",
        caption: "Neon Sign — 'OPEN'",
      },
      {
        src: `${BLOB_BASE}/showcase/3d-gold.webp`,
        alt: "The word VICTORY in 3D gold lettering on dark background",
        caption: "3D Gold — 'VICTORY'",
      },
      {
        src: `${BLOB_BASE}/showcase/cyberpunk.webp`,
        alt: "The word SYSTEM in cyberpunk glitch style with neon city",
        caption: "Cyberpunk Glitch — 'SYSTEM'",
      },
      {
        src: `${BLOB_BASE}/showcase/holographic.webp`,
        alt: "The word AURA in iridescent holographic chrome",
        caption: "Holographic Chrome — 'AURA'",
      },
      {
        src: `${BLOB_BASE}/showcase/youtube-thumbnail.webp`,
        alt: "The word INSANE in bold YouTube thumbnail style",
        caption: "YouTube Thumbnail — 'INSANE'",
      },
    ],
  },
  howItWorks: {
    title: "Generate an AI text effect in 3 steps",
    steps: [
      {
        emoji: "⌨️",
        title: "Type your word",
        description:
          "Short words (3-10 characters) work best. The AI renders the actual letters inside the scene, so a single bold word reads cleanest.",
      },
      {
        emoji: "🎨",
        title: "Pick a style",
        description:
          "13 cinematic presets: realistic fire, blue plasma flame, neon sign, 3D gold, cyberpunk, gaming banner, horror cursed, holographic, ancient stone, YouTube thumbnail, minimalist logo, Twitch panel, heavy metal.",
      },
      {
        emoji: "⚡",
        title: "Generate & download",
        description:
          "Result appears in 5-15 seconds. Download as PNG, share with one click, or remix with a different style — same word, totally different vibe.",
      },
    ],
  },
  whyUse: {
    title: "Why use our AI text effect generator",
    features: [
      {
        emoji: "🌟",
        title: "Real AI, not CSS tricks",
        description:
          "CSS text effects look flat and graphic. AI generates a real scene — flames have depth, neon glows on a textured wall, gold reflects on marble.",
      },
      {
        emoji: "📚",
        title: "13 cinematic styles",
        description:
          "Each style is a hand-tuned prompt template baked with the best model parameters. Get production-quality results without writing prompts.",
      },
      {
        emoji: "🪄",
        title: "Best-in-class text rendering",
        description:
          "Built on Google's Nano Banana (Gemini 2.5 Flash Image) — currently the most accurate model for rendering specific letters inside a generated scene.",
      },
      {
        emoji: "🔗",
        title: "Sharable & remixable",
        description:
          "Every share link carries a remix prompt so friends can try the same style with their own word. Outputs auto-watermarked when shared.",
      },
      {
        emoji: "💼",
        title: "Use commercially",
        description:
          "Outputs are yours to keep — band logos, gaming thumbnails, podcast cover art, marketing graphics, client work. No license fees.",
      },
      {
        emoji: "🆓",
        title: "Free, no signup",
        description:
          "1 generation per hour and 3 per day per user. No account, no credit card, no email collection. Just type and generate.",
      },
    ],
  },
  useCases: {
    title: "What you can build with AI text effects",
    items: [
      {
        title: "YouTube video thumbnails",
        description:
          "Drop the generated text into your thumbnail composition. Yellow outline + red shadow styles are tuned for maximum click-through in crowded feeds.",
        examplePrompt: 'Style: YouTube Thumbnail · Word: "INSANE"',
      },
      {
        title: "Gaming / esports branding",
        description:
          "Twitch panels, Discord server banners, tournament logos, gaming clip thumbnails. Heavy metal, cyberpunk, and gaming banner styles all work great.",
        examplePrompt: 'Style: Gaming Banner · Word: "WINNER"',
      },
      {
        title: "Music & album art",
        description:
          "Band logos, single covers, festival flyers, lyric quote graphics. Heavy metal style nails the metalcore aesthetic; neon and holographic suit synthwave.",
        examplePrompt: 'Style: Heavy Metal · Word: "INFERNO"',
      },
      {
        title: "Brand & product wordmarks",
        description:
          "Minimalist logo style produces clean modern wordmarks — perfect for startup landing pages, MVP brand mockups, and quick logo concepts.",
        examplePrompt: 'Style: Minimalist Logo · Word: "BRAND"',
      },
      {
        title: "Social media quote graphics",
        description:
          "Instagram quote tiles, Pinterest pins, Twitter header art. Single-word emphasis posts using realistic fire, neon, or stone carving all stop the scroll.",
        examplePrompt: 'Style: Ancient Stone Carving · Word: "LEGEND"',
      },
      {
        title: "Halloween & event graphics",
        description:
          "Horror cursed style for Halloween parties; gold for weddings and anniversaries; fire for product launches. One-word event graphics in seconds.",
        examplePrompt: 'Style: Horror Cursed · Word: "CURSED"',
      },
      {
        title: "Print-on-demand designs",
        description:
          "Generate text art for t-shirts, mugs, posters, phone cases. Output resolution works fine for most POD sites — upscale further if you need 4K.",
        examplePrompt: 'Style: Holographic Chrome · Word: "AURA"',
      },
    ],
  },
  proTips: {
    title: "Tips for the best text effect results",
    tips: [
      "**One short word beats a phrase.** AI models render specific letters more accurately at 3-10 characters. 'BLAZE' will render perfectly; 'THE GREAT BLAZE OF 1989' usually won't.",
      "**Use ALL CAPS for drama.** Caps render more readable in flame, neon, and 3D styles. Lowercase works well for cursive and minimalist styles.",
      "**Common letters > unusual symbols.** Numbers and ampersands sometimes render imperfectly. Stick to A-Z for the most reliable results.",
      "**Match the word to the style.** 'CURSED' in horror style hits harder than 'HAPPY'. 'WINNER' in gaming banner beats 'CALM'. The semantics matter.",
      "**If a letter looks wrong, regenerate.** Same prompt produces slightly different results each time. Two or three runs almost always include a perfect version.",
      "**Pair with the AI Image Editor.** Generate the text art, then drop into the editor to add your face, product, or a different background. The two tools chain naturally.",
    ],
  },
  cta: {
    headline: "Turn any word into a cinematic image",
    subline: "13 hand-tuned styles — free, no signup, downloads as PNG.",
    buttonLabel: "Generate your text →",
  },
};

// =============================================================================
// AI PET PORTRAIT GENERATOR (pet/ai-pet-portrait-generator)
// =============================================================================
const aiPetPortrait: RichContent = {
  heroSubtitle:
    "Upload one photo of your pet and pick a style — knight in shining armour, astronaut floating in space, mafia boss in pinstripe suit, Renaissance oil painting. The AI keeps your pet's actual face and adds the costume and scene around it.",
  gallery: {
    title: "Real pet portraits generated with one source photo",
    subtitle: "Each is the same pet photo run through a different style",
    items: [
      {
        src: `${BLOB_BASE}/pet-showcase/renaissance-painting.webp`,
        alt: "Pet in 17th-century Renaissance oil painting style with velvet doublet",
        caption: "Renaissance Painting",
      },
      {
        src: `${BLOB_BASE}/pet-showcase/mafia-boss.webp`,
        alt: "Pet dressed as 1920s mafia boss in pinstripe suit and fedora",
        caption: "Mafia Boss",
      },
      {
        src: `${BLOB_BASE}/pet-showcase/astronaut.webp`,
        alt: "Pet in NASA spacesuit floating in space with Earth in background",
        caption: "Astronaut",
      },
      {
        src: `${BLOB_BASE}/pet-showcase/medieval-knight.webp`,
        alt: "Pet in shining silver plate armour with sword and red cape",
        caption: "Medieval Knight",
      },
      {
        src: `${BLOB_BASE}/pet-showcase/samurai.webp`,
        alt: "Pet in traditional samurai armour with cherry blossoms behind",
        caption: "Samurai",
      },
      {
        src: `${BLOB_BASE}/pet-showcase/wizard.webp`,
        alt: "Pet wearing wizard robe and hat in ancient library with glowing staff",
        caption: "Wizard",
      },
    ],
  },
  howItWorks: {
    title: "How to turn your pet photo into art in 3 steps",
    steps: [
      {
        emoji: "🐾",
        title: "Upload one clear pet photo",
        description:
          "A sharp, well-lit, eye-level shot where the pet's face is fully visible gives the best results. Most modern phone photos work — no studio gear needed.",
      },
      {
        emoji: "👑",
        title: "Pick a style (or add custom details)",
        description:
          "12 hand-tuned styles: knight, astronaut, chef, mafia boss, doctor, Renaissance painting, superhero, samurai, business CEO, rockstar, wizard, gym athlete. Or add a free-form prompt for unique touches.",
      },
      {
        emoji: "📥",
        title: "Download a print-ready portrait",
        description:
          "Generation takes 8-20 seconds. Download a high-resolution PNG — ready for prints, mugs, holiday cards, or social profiles.",
      },
    ],
  },
  whyUse: {
    title: "Why use our AI pet portrait generator",
    features: [
      {
        emoji: "🎯",
        title: "Keeps your pet's identity",
        description:
          "Powered by Nano Banana Edit which preserves the pet's exact face, breed, fur colour, and identifying features — only the costume and scene change.",
      },
      {
        emoji: "🎨",
        title: "12 cinematic styles",
        description:
          "Knight, astronaut, chef, mafia boss, doctor, Renaissance, superhero, samurai, CEO, rockstar, wizard, gym athlete — each hand-tuned with detailed prompts.",
      },
      {
        emoji: "✍️",
        title: "Custom details supported",
        description:
          "Add free-form notes like 'wearing red sunglasses' or 'on a beach at sunset' to personalize any preset style.",
      },
      {
        emoji: "🐶",
        title: "Works for any pet",
        description:
          "Dogs, cats, rabbits, hamsters, parrots, ferrets, lizards — anything with a clear face. The model handles all common species.",
      },
      {
        emoji: "🖨️",
        title: "Print-ready quality",
        description:
          "Output resolution is high enough for canvas prints, mugs, t-shirts, phone cases, and 8×10 framed prints. Holiday card season is a popular use.",
      },
      {
        emoji: "🆓",
        title: "Free, no signup",
        description:
          "1 portrait per hour and 3 per day — no account, no credit card, no watermark. We keep limits tight to spread our daily image-gen budget across more users.",
      },
    ],
  },
  useCases: {
    title: "What you can do with AI pet portraits",
    items: [
      {
        title: "Holiday & birthday cards",
        description:
          "Print custom pet portraits as Christmas, birthday, or anniversary cards. Renaissance and Royal painting styles make extra-classy keepsakes.",
        examplePrompt: 'Style: Renaissance Painting · Custom: "wearing a small gold crown"',
      },
      {
        title: "Custom pet merch",
        description:
          "Mugs, t-shirts, tote bags, phone cases, stickers. Print-on-demand sites accept the PNG straight from this tool with no extra editing.",
        examplePrompt: 'Style: Superhero · Custom: "on a bright comic-book background"',
      },
      {
        title: "Social media profile pictures",
        description:
          "Stand out on Instagram, Twitter, Discord with a one-of-a-kind pet portrait as your avatar. The wizard, astronaut, and rockstar styles are most popular.",
        examplePrompt: 'Style: Astronaut · Custom: "helmet visor reflecting Earth"',
      },
      {
        title: "Pet memorial portraits",
        description:
          "A Renaissance or royal oil painting style makes a thoughtful tribute. Many users print these for framed memorial keepsakes.",
        examplePrompt: 'Style: Renaissance Painting · Custom: "soft warm lighting"',
      },
      {
        title: "Vet office & boutique decor",
        description:
          "Veterinary clinics and pet boutiques use generated portraits as decoration, in marketing emails, and on website hero sections.",
        examplePrompt: 'Style: Doctor · Custom: "standing next to a small medical chart"',
      },
      {
        title: "Personalized phone wallpapers",
        description:
          "Turn your pet into a knight, astronaut, or superhero and set it as your lock screen. Use 9:16 framing for vertical phone wallpapers (coming soon).",
        examplePrompt: 'Style: Medieval Knight · Custom: "standing on a misty cliff edge"',
      },
      {
        title: "Pet birthday gift for friends",
        description:
          "Surprise a pet-parent friend with a custom AI portrait of their dog or cat. Pair with a $10 frame from Amazon for a memorable gift under $20.",
        examplePrompt: 'Style: Mafia Boss · Custom: "holding a wine glass"',
      },
    ],
  },
  proTips: {
    title: "How to get the best pet portrait results",
    tips: [
      "**Use a sharp, well-lit photo.** Natural daylight near a window beats indoor lamps. The pet's face should be the brightest element in the source photo.",
      "**One pet per photo.** Group shots with multiple pets confuse the model. Crop down to a single pet first if your photo has more than one.",
      "**Eye-level shots work best.** A photo taken at the pet's eye level (crouch down to their level) produces more anatomically natural portraits than top-down phone shots.",
      "**Add specific custom details.** 'Wearing red aviator sunglasses' is better than 'sunglasses'. 'Holding a small football' is better than 'with a toy'. Specificity helps.",
      "**Regenerate if a detail looks off.** Same source + same prompt produces different outputs each time. Two or three runs usually include one perfect version.",
      "**Print at 8×10 or larger.** Output resolution is plenty for 8×10 prints. Larger canvas prints (12×18, 16×24) also work well — just keep the framing in mind when picking the style.",
    ],
  },
  cta: {
    headline: "Turn your pet into a knight, astronaut, or wizard",
    subline:
      "Free AI pet portrait generator — 12 styles, no signup, print-ready quality.",
    buttonLabel: "Upload a pet photo →",
  },
};

// =============================================================================
// Registry — slug → RichContent
// =============================================================================

export const RICH_CONTENT: Record<string, RichContent> = {
  "ai-image-editor": aiImageEditor,
  "ai-text-effect": aiTextEffect,
  "ai-pet-portrait-generator": aiPetPortrait,
};

export function getRichContent(slug: string): RichContent | undefined {
  return RICH_CONTENT[slug];
}
