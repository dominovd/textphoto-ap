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
    | "bg-remove"
    | "upscale"
    | "colorize"
    | "cartoon"
    | "instagram-bio"
    | "ai-text-effect"
    | "pet-portrait"
    | "ai-image-edit"
    | null;
  faq: { q: string; a: string }[];
  featured?: boolean;
};

export const tools: Tool[] = [
  // === CAPTIONS ===
  {
    slug: "instagram-caption-generator",
    category: "captions",
    name: "Free AI Instagram Caption Generator",
    shortDescription:
      "Drop a photo → 10 caption ideas with hashtags. Free AI, no signup.",
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
    name: "Free AI TikTok Caption Generator",
    shortDescription:
      "Free AI TikTok captions — hooks + hashtags optimised for the For You page.",
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
    name: "Free AI Photo Caption Generator",
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
    name: "Free AI Instagram Bio Generator",
    shortDescription:
      "Free AI bio writer — 10 ideas in 6 styles, fits the 150-char limit. No signup.",
    longDescription:
      "Tell us your niche (e.g. fitness coach, food blogger, indie dev), pick a vibe, optionally add keywords — get 10 bios crafted to fit Instagram's 150-character limit. Vary tones from aesthetic to edgy, with or without emojis.",
    icon: "👤",
    searchVolume: 5400,
    component: "instagram-bio",
    faq: [
      {
        q: "How long is an Instagram bio?",
        a: "150 characters max. Our generator never exceeds that — character count shown next to each bio.",
      },
      {
        q: "Does it include emojis?",
        a: "Yes, you can toggle on or off. Emojis usually help engagement.",
      },
      {
        q: "Can I use these commercially?",
        a: "Yes — bios are yours to use anywhere.",
      },
    ],
  },

  // === OCR ===
  {
    slug: "image-to-text",
    category: "ocr",
    name: "Free AI Image to Text (OCR)",
    shortDescription:
      "Free AI OCR — extract text from any image: receipts, screenshots, handwriting, scanned docs.",
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
    name: "Free AI Handwriting to Text Converter",
    shortDescription:
      "Free AI handwriting recognition — turn handwritten notes into editable text.",
    longDescription:
      "AI handwriting recognition. Upload a photo of handwritten notes, letters, or signed forms and get editable digital text. Works on both print and cursive.",
    icon: "✍️",
    searchVolume: 4400,
    component: "ocr",
    faq: [
      {
        q: "How accurate is it?",
        a: "85-95% for clear handwriting, lower for cursive or messy writing. Genuinely illegible words are marked [unclear].",
      },
      {
        q: "Does it work on cursive?",
        a: "Yes, but expect lower accuracy than print. Best results with a clear, well-lit photo.",
      },
      {
        q: "Is my image stored?",
        a: "No. Images are processed and deleted from our servers immediately.",
      },
    ],
  },
  {
    slug: "translate-from-photo",
    category: "ocr",
    name: "Free AI Photo Translator",
    shortDescription:
      "Free AI photo translator — extract + translate text from any image in one click.",
    longDescription:
      "Two steps in one — OCR + translation. Useful for menus, signs, documents, screenshots in foreign languages. Pick your target language and get both the original detected text and the translation.",
    icon: "🌐",
    searchVolume: 9900,
    component: "ocr",
    faq: [
      {
        q: "How many languages are supported?",
        a: "30+ source languages auto-detected. 14 target languages including English, Spanish, French, German, Russian, Chinese, Japanese, Arabic.",
      },
      {
        q: "Does it work on handwriting?",
        a: "Best with printed text. For handwriting, use our dedicated Handwriting to Text tool first.",
      },
      {
        q: "Is my image stored?",
        a: "No. Images are processed and deleted from our servers immediately.",
      },
    ],
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
    name: "Free AI Alt Text Generator",
    shortDescription:
      "Free AI alt text — generate SEO-friendly descriptions for any image in 1 click.",
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

  // === PHOTO ENHANCEMENT (image-to-image via fal.ai + Replicate fallback) ===
  {
    slug: "photo-upscaler",
    category: "enhance",
    name: "Free AI Photo Upscaler",
    shortDescription:
      "Free AI photo upscaler — 2× or 4× without losing quality. Realistic detail, no signup.",
    longDescription:
      "Upload any photo and get back a sharper, higher-resolution version — 2× or 4× larger. Powered by AI super-resolution models that add realistic detail, not just bigger pixels. Great for small product shots, old photos, or screenshots you need to print.",
    icon: "🔍",
    searchVolume: 8100,
    component: "upscale",
    featured: true,
    faq: [
      {
        q: "How big can the output be?",
        a: "4× a 1024×1024 image gives you 4096×4096 — plenty for print or HD display.",
      },
      {
        q: "Is 4× always better than 2×?",
        a: "Not necessarily. 4× takes 3× longer and is overkill if you only need moderate sharpening. 2× is the sweet spot for most cases.",
      },
      {
        q: "Does it work on faces?",
        a: "Yes — the AI is good at preserving facial features. Best results with clear, well-lit input.",
      },
      {
        q: "What's the max file size?",
        a: "10 MB on upload. Output is PNG.",
      },
    ],
  },
  {
    slug: "background-remover",
    category: "enhance",
    name: "Free AI Background Remover",
    shortDescription:
      "Free AI background remover — clean cut-out from any photo in 2 seconds. No signup.",
    longDescription:
      "Drop a photo and get back a transparent PNG with the background removed — clean cut-out edges, even on hair and fur. Powered by an AI model that runs in seconds. Use it for product shots, profile pics, social media, design comps.",
    icon: "✂️",
    searchVolume: 49500,
    component: "bg-remove",
    featured: true,
    faq: [
      {
        q: "Is it really free?",
        a: "Yes — free with a daily limit. No sign up, no credit card.",
      },
      {
        q: "What's the output quality?",
        a: "Transparent PNG, same resolution as your input. Clean edges on most subjects including hair, fur, and complex shapes.",
      },
      {
        q: "What file formats are supported?",
        a: "JPG, PNG, WEBP. Max 10 MB.",
      },
      {
        q: "Is my image stored?",
        a: "No. Images are processed and deleted from our servers immediately.",
      },
      {
        q: "Does it work on people, products, animals?",
        a: "Yes — all of those. Best results when the subject is clearly visible against a contrasting background.",
      },
    ],
  },

  // === ENHANCE — AI Image Editor (Nano Banana Edit, free-form prompt) ===
  {
    slug: "ai-image-editor",
    category: "enhance",
    name: "Free AI Image Editor",
    shortDescription:
      "Free AI image editor — change background, color, or add details with a text prompt. No signup.",
    longDescription:
      "Upload an image, type what you want changed in plain English, and the AI applies the edit. Powered by Google's Nano Banana (Gemini 2.5 Flash Image) — the best model right now for preserving the original subject while transforming everything else. Works for: background changes, color swaps, object removal, adding sunglasses or hats, converting photos to sketches, product mockups, you name it. Free, no signup, output as PNG.",
    icon: "🪄",
    searchVolume: 18100,
    component: "ai-image-edit",
    featured: true,
    faq: [
      {
        q: "How is this different from Photoshop?",
        a: "Photoshop is a manual tool — you click and drag. This is prompt-based — you describe the edit in words and the AI does the heavy lifting in 10-20 seconds. Great for one-off edits where setting up Photoshop layers isn't worth the time.",
      },
      {
        q: "Will it preserve the original photo's quality?",
        a: "Yes — Nano Banana is designed to keep the original subject sharp and only modify what you ask. Resolution stays close to the input.",
      },
      {
        q: "What kinds of edits work best?",
        a: "Background changes, color swaps, object removal, adding small elements (glasses, hats, jewelry), style transfers (sketch, oil painting, anime). Avoid asking for many edits in one prompt — one or two at a time gives the best results.",
      },
      {
        q: "Why is there a usage limit?",
        a: "AI image editing costs us ~$0.04 per call. The 1/hour and 3/day per user cap lets us keep this tool free for everyone.",
      },
      {
        q: "Is my image stored?",
        a: "Your uploaded image is processed and deleted from our servers shortly after the edit. The result is hosted on a CDN for a few hours so you can download it.",
      },
      {
        q: "Can I use the result commercially?",
        a: "Yes — outputs are yours to use anywhere: client work, ecommerce listings, social posts.",
      },
      {
        q: "Tips for the best results?",
        a: "Be specific. 'Change the car to deep emerald green' is better than 'green car'. For complex edits, do them in steps — edit, download, re-upload, edit again.",
      },
    ],
  },

  // === ENHANCE — Colorize + Cartoon (Replicate-only) ===
  {
    slug: "photo-colorizer",
    category: "enhance",
    name: "Free AI Photo Colorizer",
    shortDescription:
      "Colorize black-and-white photos with AI. Free, no signup.",
    longDescription:
      "Upload a black-and-white or faded colour photo and get back a realistic colorized version. Powered by DeOldify — the open-source model behind many commercial colourizers. Takes 30-60 seconds per photo.",
    icon: "🎨",
    searchVolume: 6600,
    component: "colorize",
    faq: [
      {
        q: "What kinds of photos work best?",
        a: "Classic B&W portraits, landscapes, family photos. Old colour photos can also benefit from a refresh.",
      },
      {
        q: "How long does it take?",
        a: "Usually 30-60 seconds per photo.",
      },
      {
        q: "Is the result historically accurate?",
        a: "AI infers plausible colours — it doesn't know the real colours of objects in the original scene. Results are realistic but not guaranteed accurate.",
      },
    ],
  },
  {
    slug: "photo-to-cartoon",
    category: "enhance",
    name: "Free AI Photo to Cartoon Converter",
    shortDescription:
      "Free AI cartoonifier — turn any photo into a cartoon-style illustration. No signup.",
    longDescription:
      "Upload a photo and get back a cartoonified version — clean lines, simplified shapes, illustration style. Works on faces, pets, products, scenes.",
    icon: "🎭",
    searchVolume: 8100,
    component: "cartoon",
    faq: [
      {
        q: "What works best?",
        a: "Clear, well-lit subjects. Faces with good lighting come out great. Busy backgrounds can be tricky.",
      },
      {
        q: "How long does it take?",
        a: "Usually 20-40 seconds per photo.",
      },
    ],
  },

  // === TEXT ART (AI text-to-image — Nano Banana / Ideogram) ===
  {
    slug: "ai-text-effect",
    category: "text-art",
    name: "Free AI Text Effect Generator",
    shortDescription:
      "Free AI text effects — type a word, pick a style, get a cinematic image. Fire, neon, gold, cyberpunk, and more.",
    longDescription:
      "Real AI image generation, not CSS tricks. The model renders your text as part of a full scene — realistic fire flames, glowing neon signs, premium gold logos, cyberpunk holograms. Download as PNG, share on socials. Built on Google's Nano Banana (Gemini 2.5 Flash Image), the best model for rendering specific text inside images.",
    icon: "🎨",
    searchVolume: 4400,
    component: "ai-text-effect",
    featured: true,
    faq: [
      {
        q: "How is this different from your Fire / Neon / Gold CSS tools?",
        a: "CSS tools apply styling to text in real-time, but the result looks flat and graphic. This one generates a real image — flames have depth, neon glows on a real wall, gold reflects on marble. Better for posters, banners, social shares.",
      },
      {
        q: "Why are there usage limits?",
        a: "AI image generation costs us ~$0.04 per image. To keep the tool free, we cap it at 1 per hour and 3 per day per user.",
      },
      {
        q: "Can I commercially use the outputs?",
        a: "Yes — outputs are yours to use anywhere.",
      },
      {
        q: "What model is it?",
        a: "Google Nano Banana (Gemini 2.5 Flash Image) as primary, Ideogram v3 as fallback.",
      },
    ],
  },

  // --- Use-case landing pages — same backend, pre-selected style, custom SEO ---
  {
    slug: "fire-text-generator",
    category: "text-art",
    name: "Free AI Fire Text Generator",
    shortDescription:
      "Free AI fire text generator — realistic orange flames forming any word you type.",
    longDescription:
      "AI-generated fire text — real flame textures, embers, smoke, cinematic lighting. Type a word, get a high-resolution image with your text engulfed in fire. Choose between classic orange flames, blue plasma flame, inferno, or toxic green. Download as PNG, post anywhere — gaming logos, band art, posters, video thumbnails.",
    icon: "🔥",
    searchVolume: 1300,
    component: "ai-text-effect",
    faq: [
      {
        q: "Is this real fire, not just orange CSS?",
        a: "Yes — AI generates a real image with photorealistic flame textures, glow, embers. Compare to our CSS Fire Text Generator (instant but flat).",
      },
      {
        q: "Can I get blue flames?",
        a: "Yes — pick the 'Blue Flame' or 'Toxic' variant from the style selector.",
      },
      {
        q: "What sizes does it output?",
        a: "Default is 16:9 landscape, perfect for video thumbnails and banners.",
      },
    ],
  },
  {
    slug: "neon-sign-generator",
    category: "text-art",
    name: "Free AI Neon Sign Generator",
    shortDescription:
      "Turn any word into a glowing neon sign on a brick wall. AI-generated.",
    longDescription:
      "Generate a realistic glowing neon sign with your custom text — bent neon tubes, soft glow on the surface behind, retro diner aesthetic. Unlike CSS neon effects (flat color + shadow), this is a full scene: real-looking glass tubes against a textured wall.",
    icon: "💡",
    searchVolume: 4400,
    component: "ai-text-effect",
    faq: [
      {
        q: "How is this different from a CSS neon effect?",
        a: "CSS gives you glowing text on a flat background. This is a full image: realistic neon tubes mounted on a brick wall, ambient glow, photographic quality. Better for shareable graphics.",
      },
      {
        q: "Can I choose the color?",
        a: "The default is pink/cyan retro style. For more color control, generate multiple times — prompt variations give different palettes.",
      },
      {
        q: "What can I use it for?",
        a: "Bar/cafe branding mockups, Instagram quotes, Twitch overlays, podcast cover art, business announcements.",
      },
    ],
  },
  {
    slug: "3d-text-generator",
    category: "text-art",
    name: "Free AI 3D Text Generator",
    shortDescription:
      "Premium 3D rendered text — gold, chrome, marble, bronze. AI-generated.",
    longDescription:
      "Generate luxurious 3D text in metallic gold, white gold, bronze, or rose gold finishes. Realistic depth, lighting, reflections — the kind of premium product render that would take an hour in Blender or Cinema 4D. Get one in 8 seconds.",
    icon: "🏆",
    searchVolume: 6600,
    component: "ai-text-effect",
    faq: [
      {
        q: "What finishes are available?",
        a: "Classic gold, rose gold, white gold (silver), bronze — pick from style selector.",
      },
      {
        q: "Can I use this for client work?",
        a: "Yes — outputs are yours to use commercially. Great for product mockups, packaging concepts, premium brand identity.",
      },
      {
        q: "What backgrounds work best?",
        a: "Defaults to black marble for premium feel. You can edit the output in Photoshop or use Background Remover to swap.",
      },
    ],
  },
  {
    slug: "youtube-thumbnail-text",
    category: "text-art",
    name: "Free AI YouTube Thumbnail Text Generator",
    shortDescription:
      "Free AI YouTube thumbnail text — bold high-CTR letters, yellow outline, red shadow.",
    longDescription:
      "Generate the kind of bold, eye-catching text overlay that YouTube creators pay designers for. Yellow outlined letters, dramatic red drop shadow, the click-bait aesthetic that pulls clicks. Type your hook word — get an image you can drop straight into your thumbnail composition.",
    icon: "▶️",
    searchVolume: 5400,
    component: "ai-text-effect",
    faq: [
      {
        q: "Will this guarantee me more views?",
        a: "No — but text styling is a known CTR factor. Pair this with a strong face/object on the left side and a curiosity-driving title.",
      },
      {
        q: "What size should I make the thumbnail?",
        a: "YouTube thumbnails are 1280×720 (16:9). This tool outputs at 16:9 — drop the result into Canva, Photoshop, or Figma and add your other elements.",
      },
      {
        q: "Should the text overlap with my face/subject?",
        a: "Typically yes — overlapping text by 5-10% with the subject reads as 'composed' rather than 'stickered on'.",
      },
    ],
  },
  {
    slug: "discord-banner-text",
    category: "text-art",
    name: "Free AI Discord Banner Text Generator",
    shortDescription:
      "Free AI Discord banner text — bold gaming letters with fire, sparks, esports aesthetic.",
    longDescription:
      "Generate banner-quality text for your Discord server, gaming community, or esports team. Dramatic lighting, sparks, explosive composition. Drop the output into your server banner, role icon, or announcement post.",
    icon: "🎮",
    searchVolume: 1600,
    component: "ai-text-effect",
    faq: [
      {
        q: "What aspect ratio for a Discord banner?",
        a: "Discord server banners are 960×540 (16:9). This tool outputs 16:9 — fits perfectly.",
      },
      {
        q: "Can I use it for Discord role/badge icons?",
        a: "Yes — crop the central part of the output for square badge formats.",
      },
      {
        q: "Will it work for non-gaming communities?",
        a: "The 'gaming-banner' style leans esports. For a different vibe, try our other styles from the main AI Text Effect tool.",
      },
    ],
  },
  {
    slug: "twitch-panel-text",
    category: "text-art",
    name: "Free AI Twitch Panel Text Generator",
    shortDescription:
      "Free AI Twitch panel headers — custom purple gaming aesthetic for your channel.",
    longDescription:
      "Generate the panel header graphics for your Twitch profile — 'About', 'Schedule', 'Donate', whatever you need. Purple-and-black gaming aesthetic with glowing accents that matches Twitch's UI. Way better than typing plain text into a flat banner.",
    icon: "🎮",
    searchVolume: 880,
    component: "ai-text-effect",
    faq: [
      {
        q: "What size are Twitch panels?",
        a: "Twitch panel images are 320×100. The tool outputs at higher resolution — crop to fit, you'll keep more detail than designing at 320×100 directly.",
      },
      {
        q: "Can I generate multiple panels with consistent style?",
        a: "Yes — use the same style for each panel header (About, Schedule, Socials, Donate, etc.) and they'll feel like a set.",
      },
    ],
  },
  {
    slug: "logo-text-generator",
    category: "text-art",
    name: "Free AI Logo Text Generator",
    shortDescription:
      "Free AI logo text generator — clean minimalist wordmark with premium typography.",
    longDescription:
      "Generate a clean, minimalist logo wordmark for your brand or product. Modern sans-serif typography with lots of negative space, single accent color, premium feel. Great starting point for indie products, personal brands, side-project naming, packaging mockups.",
    icon: "⚪",
    searchVolume: 8100,
    component: "ai-text-effect",
    faq: [
      {
        q: "Will the output be vector / SVG?",
        a: "No — outputs are PNG at high resolution. For vector (Illustrator/Figma), you'd need to trace the result manually or use a hire-a-designer step.",
      },
      {
        q: "Is this enough for a final brand identity?",
        a: "Honestly — for a real business you'll want a designer. But this is a great starting point for landing-page placeholders, side-project naming, or rapid iteration on logo direction.",
      },
      {
        q: "Can I generate multiple variations?",
        a: "Yes — same prompt usually gives different outputs each time. Try several to find your favourite direction.",
      },
    ],
  },

  // === PET PORTRAITS (image-to-image via Nano Banana edit) ===
  {
    slug: "ai-pet-portrait-generator",
    category: "pet",
    name: "Free AI Pet Portrait Generator",
    shortDescription:
      "Free AI pet portraits — turn your pet into a knight, astronaut, chef, and 9 more styles. No signup.",
    longDescription:
      "Upload one clear photo of your pet and pick a style — knight in shining armor, astronaut floating in space, mafia boss in a pinstripe suit, chef in a kitchen, Renaissance oil painting. The AI keeps your pet's actual face, breed, and fur color and composes the costume and scene around it. Download as PNG and share. Powered by Google's Nano Banana (Gemini 2.5 Flash Image), the best model for preserving subject identity while editing.",
    icon: "🐾",
    searchVolume: 1300,
    component: "pet-portrait",
    featured: true,
    faq: [
      {
        q: "Will it actually look like my pet?",
        a: "Yes — Nano Banana preserves the pet's face, breed, fur color, and identifying features. Best results with a clear, well-lit, eye-level photo where the pet's face is fully visible.",
      },
      {
        q: "Is this completely free?",
        a: "Yes. No sign up, no credit card. Limited to 1 portrait per hour and 3 per day to keep the tool free for everyone.",
      },
      {
        q: "Why are there usage limits?",
        a: "AI image generation costs us ~$0.04 per image. The daily limit lets us spread our $3/day image-gen budget across more people.",
      },
      {
        q: "Can I add my own custom details to the prompt?",
        a: "Yes — there's an optional 'custom details' field where you can add things like 'wearing red sunglasses' or 'on a beach'. Keep it short (under 200 chars) and concrete.",
      },
      {
        q: "What kinds of pets work?",
        a: "Dogs, cats, rabbits, hamsters, parrots, ferrets, lizards — anything with a clear face. Multi-pet group photos are trickier; one pet per photo gives the best results.",
      },
      {
        q: "Is my photo stored?",
        a: "Your uploaded photo is processed and deleted from our servers shortly after generation. The generated image is hosted on a CDN for a few hours so you can download it.",
      },
      {
        q: "Can I use the result commercially?",
        a: "Yes — outputs are yours to use anywhere: prints, mugs, holiday cards, social media, anywhere.",
      },
    ],
  },

  // --- Use-case landing pages — same backend, pre-selected style, custom SEO ---
  {
    slug: "renaissance-pet-portrait",
    category: "pet",
    name: "Free AI Renaissance Pet Portrait Generator",
    shortDescription:
      "Free AI Renaissance pet portrait — turn your pet into a 17th-century oil painting with royal velvet.",
    longDescription:
      "Upload one photo of your pet and get back a richly painted Renaissance-style portrait — your pet in a velvet doublet with lace ruff collar, painted in the style of Rembrandt or Van Dyck, dark moody chiaroscuro lighting, visible oil brushstrokes. The AI preserves your pet's breed, fur color, and face. The trending viral pet portrait style, made free.",
    icon: "🎨",
    searchVolume: 1900,
    component: "pet-portrait",
    featured: true,
    faq: [
      {
        q: "Will it look like my pet?",
        a: "Yes — the model preserves your pet's breed, fur color, and face. Only the costume and scene change.",
      },
      {
        q: "Can I print this on a canvas?",
        a: "Yes — outputs are high-resolution PNG (around 1024×1024) and look great printed on canvas, framed, or used as a holiday card.",
      },
      {
        q: "How is this different from paid services like Crown & Paw?",
        a: "Paid services hire a designer to manually composite your pet into a template. This is fully AI — no human in the loop, free, and you can re-generate as many times as you like.",
      },
    ],
  },
  {
    slug: "cat-mafia-portrait",
    category: "pet",
    name: "Free AI Cat Mafia Portrait Generator",
    shortDescription:
      "Free AI cat mafia portrait — your cat as a 1920s mafia boss in pinstripe suit and fedora.",
    longDescription:
      "Upload one photo of your cat (or any pet) and get a 1920s mafia boss portrait — pinstripe suit, fedora hat, cigar, the works. Photorealistic and shareable. The AI keeps your cat's face and fur color and dresses it up. The classic pet-as-gangster meme, done in seconds.",
    icon: "🎩",
    searchVolume: 480,
    component: "pet-portrait",
    faq: [
      {
        q: "Does it work on dogs too?",
        a: "Yes — works for any pet. The style is the same.",
      },
      {
        q: "Can I add my own details (e.g. specific weapon, different hat)?",
        a: "Yes — there's a 'custom details' field where you can add things like 'wearing red sunglasses' or 'holding a violin case'.",
      },
    ],
  },
  {
    slug: "dog-astronaut-portrait",
    category: "pet",
    name: "Free AI Dog Astronaut Portrait Generator",
    shortDescription:
      "Free AI dog astronaut portrait — your dog in a NASA spacesuit with Earth in the background.",
    longDescription:
      "Upload a photo of your dog and get an astronaut portrait — white NASA spacesuit, helmet with the visor up showing your dog's face, Earth floating behind. The AI preserves your dog's breed, color, and face. Great for kids' rooms, holiday cards, social media.",
    icon: "🚀",
    searchVolume: 320,
    component: "pet-portrait",
    faq: [
      {
        q: "Does it work on cats and other pets?",
        a: "Yes — the same generator works for any pet. The style was designed for dogs but looks great with cats and rabbits too.",
      },
      {
        q: "Can I get a different background (e.g. moon surface)?",
        a: "Yes — use the 'custom details' field to add things like 'standing on the moon surface' or 'inside a space station'.",
      },
    ],
  },
  {
    slug: "ai-pet-gym-portrait",
    category: "pet",
    name: "Free AI Pet Gym Portrait Generator",
    shortDescription:
      "Free AI pet gym portrait — your pet lifting dumbbells with headphones, viral meme aesthetic.",
    longDescription:
      "Upload your pet's photo and turn them into a buff gym athlete — black tank top, dumbbells in their paws, red over-ear headphones, modern gym in the background. The viral 'pet at the gym' aesthetic that flooded TikTok and Reddit. AI keeps your pet's face and breed.",
    icon: "💪",
    searchVolume: 210,
    component: "pet-portrait",
    faq: [
      {
        q: "Can I get a different gym scene (e.g. boxing, CrossFit)?",
        a: "Yes — use the 'custom details' field to add things like 'in a boxing ring' or 'doing a deadlift'.",
      },
    ],
  },

  // === MEMES ===
  {
    slug: "ai-meme-generator",
    category: "memes",
    name: "Free AI Meme Generator",
    shortDescription:
      "Free AI meme generator — upload a photo, get 5 viral meme captions instantly.",
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
