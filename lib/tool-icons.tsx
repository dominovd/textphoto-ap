import type { SVGProps } from "react";

/**
 * Duotone (Phosphor-style) SVG icons for tools.
 *
 * Style rules:
 *   - Two layers: a low-opacity FILL (fillOpacity ~0.2) + a same-color STROKE
 *     outline. Both use `currentColor` so the icon picks up the parent's color.
 *   - viewBox 0 0 24 24, strokeWidth 1.7, round joins/caps.
 *   - Sized to 1.4em by default (set explicit font-size on the wrapper).
 *
 * Each tool slug maps to one icon. Tools with similar function share an icon
 * (all caption tools → chat, all OCR tools → text-frame, etc.).
 *
 * Render via `<ToolIcon slug={tool.slug} />` from a parent that sets the
 * desired color (e.g. `text-purple-600`).
 */

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "1.4em",
  height: "1.4em",
  "aria-hidden": true,
};

// ---------------------------------------------------------------------------
// Icon components — duotone (fill at ~0.2 + outline)
// ---------------------------------------------------------------------------

const Chat = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="8.5" cy="11.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="12" cy="11.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="11.5" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

const BadgeUser = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="3.5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="9" r="3.5" />
    <path
      d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" />
  </svg>
);

const TextFrame = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 9h10M7 13h10M7 17h6" />
  </svg>
);

const Pen = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M15 4l5 5L9 20l-5-5L15 4z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M15 4l5 5L9 20l-5-5L15 4z" />
    <path d="M14 5l5 5" />
  </svg>
);

const Globe = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

const Sparkles = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M12 4.5L13.7 10 19 11.7 13.7 13.4 12 18.9 10.3 13.4 5 11.7 10.3 10 12 4.5z"
      fill="currentColor"
      fillOpacity="0.25"
    />
    <path d="M12 4.5L13.7 10 19 11.7 13.7 13.4 12 18.9 10.3 13.4 5 11.7 10.3 10 12 4.5z" />
    <path d="M19 4l.7 2 2 .7-2 .6L19 9l-.7-1.7-2-.6 2-.7L19 4z" />
  </svg>
);

const Wand = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M3 21l11-11 3 3L6 24"
      fill="currentColor"
      fillOpacity="0.2"
      transform="translate(0 -3)"
    />
    <path d="M3 21L14 10" />
    <path d="M11 7l5 5" />
    <path d="M16 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="currentColor" />
    <path d="M6 3l.6 1.4L8 5l-1.4.6L6 7l-.6-1.4L4 5l1.4-.6L6 3z" fill="currentColor" />
  </svg>
);

const Flame = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M12 3s4 4.5 4 9a4 4 0 0 1-8 0c0-2 1-3.5 1-3.5S10 11 12 11s0-3 0-3 0-3 0-5z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M12 3s4 4.5 4 9a4 4 0 0 1-8 0c0-2 1-3.5 1-3.5S10 11 12 11s0-3 0-3 0-5 0-5z" />
  </svg>
);

const Cube = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
  </svg>
);

const Bolt = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);

const Bubble = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="8" cy="11" r="5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="8" cy="11" r="5" />
    <circle cx="16" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
    <circle cx="16" cy="14" r="4" />
  </svg>
);

const Sun = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.25" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
  </svg>
);

const Glitch = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="1.5"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3 9h18M3 14h18M9 5v14M15 5v14" />
  </svg>
);

const Crown = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M3 7l4 4 5-7 5 7 4-4-1 12H4L3 7z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M3 7l4 4 5-7 5 7 4-4-1 12H4L3 7z" />
  </svg>
);

const Eye = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const Smile = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="9" />
    <path d="M8 14s1.5 2.5 4 2.5 4-2.5 4-2.5" />
    <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const Scissors = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="6" r="3" fill="currentColor" fillOpacity="0.2" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.2" />
    <circle cx="6" cy="18" r="3" />
    <path d="M8.5 7.5L20 19M8.5 16.5L20 5" />
  </svg>
);

const ZoomIn = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" fill="currentColor" fillOpacity="0.2" />
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3M8 11h6M11 8v6" />
  </svg>
);

const Palette = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2v-1a2 2 0 0 1 2-2h2a3 3 0 0 0 3-3 9 9 0 0 0-9-10z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2v-1a2 2 0 0 1 2-2h2a3 3 0 0 0 3-3 9 9 0 0 0-9-10z" />
    <circle cx="7.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="8" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="13.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="17" cy="9" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const Mask = (p: IconProps) => (
  <svg {...base} {...p}>
    <path
      d="M4 5h16v6a8 8 0 0 1-16 0V5z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M4 5h16v6a8 8 0 0 1-16 0V5z" />
    <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
    <path d="M9 19l-1 3M15 19l1 3" />
  </svg>
);

const Paw = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="6.5" cy="10" r="1.8" fill="currentColor" fillOpacity="0.3" />
    <circle cx="6.5" cy="10" r="1.8" />
    <circle cx="17.5" cy="10" r="1.8" fill="currentColor" fillOpacity="0.3" />
    <circle cx="17.5" cy="10" r="1.8" />
    <circle cx="9.5" cy="5.5" r="1.8" fill="currentColor" fillOpacity="0.3" />
    <circle cx="9.5" cy="5.5" r="1.8" />
    <circle cx="14.5" cy="5.5" r="1.8" fill="currentColor" fillOpacity="0.3" />
    <circle cx="14.5" cy="5.5" r="1.8" />
    <path
      d="M12 12c-2.5 0-5 2-5 4.5 0 2 1.5 3 3 3 1 0 1.5-.5 2-.5s1 .5 2 .5c1.5 0 3-1 3-3 0-2.5-2.5-4.5-5-4.5z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path d="M12 12c-2.5 0-5 2-5 4.5 0 2 1.5 3 3 3 1 0 1.5-.5 2-.5s1 .5 2 .5c1.5 0 3-1 3-3 0-2.5-2.5-4.5-5-4.5z" />
  </svg>
);

const Helmet = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="9" />
    <path d="M7 12h10" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const Fedora = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 14h14" />
    <path
      d="M6 14c0-4 2.5-7 6-7s6 3 6 7"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M6 14c0-4 2.5-7 6-7s6 3 6 7" />
    <ellipse cx="12" cy="14" rx="9" ry="1.5" />
  </svg>
);

const Dumbbell = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="9.5" width="3" height="5" rx="0.5" fill="currentColor" />
    <rect
      x="5.5"
      y="10.5"
      width="13"
      height="3"
      rx="0.5"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <rect x="5.5" y="10.5" width="13" height="3" rx="0.5" />
    <rect x="18.5" y="9.5" width="3" height="5" rx="0.5" fill="currentColor" />
  </svg>
);

const FrameArt = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="1.5"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <rect x="3" y="3" width="18" height="18" rx="1.5" />
    <path d="M3 16l5-5 4 4 3-3 6 6" />
    <circle cx="9" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

// ---------------------------------------------------------------------------
// slug → icon mapping
// ---------------------------------------------------------------------------

export const TOOL_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  // Captions
  "instagram-caption-generator": Chat,
  "tiktok-caption-generator": Chat,
  "ai-photo-caption-generator": Chat,
  "instagram-bio-generator": BadgeUser,

  // OCR
  "image-to-text": TextFrame,
  "handwriting-to-text": Pen,
  "translate-from-photo": Globe,

  // CSS text effects (legacy)
  neon: Bolt,
  fire: Flame,
  bubble: Bubble,
  cursive: Pen,
  glitch: Glitch,
  gold: Sun,

  // Alt-text
  "alt-text-generator": Eye,

  // Enhance — image-to-image
  "photo-upscaler": ZoomIn,
  "background-remover": Scissors,
  "photo-colorizer": Palette,
  "photo-to-cartoon": Mask,
  "ai-image-editor": Wand,

  // AI text art
  "ai-text-effect": Sparkles,
  "fire-text-generator": Flame,
  "neon-sign-generator": Bolt,
  "3d-text-generator": Cube,
  "youtube-thumbnail-text": Bolt,
  "discord-banner-text": Sparkles,
  "twitch-panel-text": Sparkles,
  "logo-text-generator": Crown,

  // Pet portraits
  "ai-pet-portrait-generator": Paw,
  "renaissance-pet-portrait": FrameArt,
  "cat-mafia-portrait": Fedora,
  "dog-astronaut-portrait": Helmet,
  "ai-pet-gym-portrait": Dumbbell,

  // Memes
  "ai-meme-generator": Smile,
};

const Fallback = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export function ToolIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = TOOL_ICONS[slug] || Fallback;
  return <Icon className={className} />;
}

// ---------------------------------------------------------------------------
// Per-category colours (pastel backdrop + accent foreground)
// Map each category slug → Tailwind classes for `bg` and `text`.
// ---------------------------------------------------------------------------

const CATEGORY_COLORS: Record<string, { bg: string; fg: string }> = {
  captions: { bg: "bg-pink-50", fg: "text-pink-600" },
  ocr: { bg: "bg-cyan-50", fg: "text-cyan-700" },
  effects: { bg: "bg-orange-50", fg: "text-orange-600" },
  "text-art": { bg: "bg-fuchsia-50", fg: "text-fuchsia-600" },
  memes: { bg: "bg-amber-50", fg: "text-amber-700" },
  pet: { bg: "bg-orange-50", fg: "text-orange-700" },
  "alt-text": { bg: "bg-emerald-50", fg: "text-emerald-700" },
  enhance: { bg: "bg-purple-50", fg: "text-purple-700" },
  prompts: { bg: "bg-indigo-50", fg: "text-indigo-700" },
  utilities: { bg: "bg-slate-100", fg: "text-slate-700" },
  games: { bg: "bg-lime-50", fg: "text-lime-700" },
  stickers: { bg: "bg-rose-50", fg: "text-rose-700" },
  identify: { bg: "bg-blue-50", fg: "text-blue-700" },
  names: { bg: "bg-rose-50", fg: "text-rose-700" },
};

export function getToolIconColors(categorySlug: string): {
  bg: string;
  fg: string;
} {
  return CATEGORY_COLORS[categorySlug] || { bg: "bg-slate-100", fg: "text-slate-700" };
}
