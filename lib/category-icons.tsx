import type { SVGProps } from "react";

/**
 * Inline SVG line icons for category cards. Each icon is sized to its parent's
 * font-size and uses `currentColor` so it inherits the surrounding text color
 * (white on the gradient backgrounds, accent on hover, etc.).
 *
 * Why inline SVG instead of lucide-react / phosphor:
 *   - Zero new dependencies
 *   - Full control over stroke width and visual weight
 *   - Each icon ~300 B inlined; no font/icon-set HTTP request
 */

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "1.4em",
  height: "1.4em",
  "aria-hidden": true,
};

// captions — chat bubble with three dots
const Captions = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="8.5" cy="11.5" r="0.5" fill="currentColor" />
    <circle cx="12" cy="11.5" r="0.5" fill="currentColor" />
    <circle cx="15.5" cy="11.5" r="0.5" fill="currentColor" />
  </svg>
);

// OCR — text in scanned frame
const Ocr = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 8h10" />
    <path d="M7 12h10" />
    <path d="M7 16h6" />
  </svg>
);

// effects — sparkles
const Effects = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    <path d="M12 8.5L13.5 12 17 13.5 13.5 15 12 18.5 10.5 15 7 13.5 10.5 12 12 8.5z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

// text-art — wand with stars
const TextArt = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M15 4l5 5L9 20l-5-5L15 4z" />
    <path d="M14 5l5 5" />
    <path d="M19 3v2M21 4h-2M5 18v2M3 19h2" />
  </svg>
);

// memes — laughing face
const Memes = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 9l-.5 1M15 9l.5 1" />
  </svg>
);

// pet — paw print
const Pet = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="6.5" cy="10" r="1.7" />
    <circle cx="17.5" cy="10" r="1.7" />
    <circle cx="9.5" cy="5.5" r="1.7" />
    <circle cx="14.5" cy="5.5" r="1.7" />
    <path d="M12 12c-2.5 0-5 2-5 4.5 0 2 1.5 3 3 3 1 0 1.5-.5 2-.5s1 .5 2 .5c1.5 0 3-1 3-3 0-2.5-2.5-4.5-5-4.5z" />
  </svg>
);

// alt-text — universal access circle
const AltText = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="6.5" r="0.9" fill="currentColor" />
    <path d="M7 10c2 .8 3 1 5 1s3-.2 5-1" />
    <path d="M12 11v3l-2.5 6M12 14l2.5 6" />
  </svg>
);

// enhance — wand + image frame
const Enhance = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="4.5" width="14" height="11" rx="2" />
    <circle cx="8" cy="9" r="1.3" />
    <path d="M3 13l3.5-3.5 4 4" />
    <path d="M17 17.5l3.5 3.5M19 16l3 3M15 17l1.5 1.5" />
  </svg>
);

// prompts — palette + cursor
const Prompts = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2v-1a2 2 0 0 1 2-2h2a3 3 0 0 0 3-3 9 9 0 0 0-9-10z" />
    <circle cx="7" cy="12" r="1" fill="currentColor" />
    <circle cx="9" cy="8" r="1" fill="currentColor" />
    <circle cx="13" cy="6" r="1" fill="currentColor" />
    <circle cx="17" cy="9" r="1" fill="currentColor" />
  </svg>
);

// utilities — crossed wrench + screwdriver
const Utilities = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14.7 6.3a4 4 0 0 0-5.5 5.5L3 18l3 3 6.2-6.2a4 4 0 0 0 5.5-5.5l-2.5 2.5-2.5-2.5 2.5-2.5z" />
    <path d="M16 16l4 4" />
    <path d="M16 19l3-3" />
  </svg>
);

// games — pencil with squiggle
const Games = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M16 3l5 5L8 21H3v-5L16 3z" />
    <path d="M14 5l5 5" />
  </svg>
);

// stickers — sticker peel + face
const Stickers = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10l6-6V8.5L15.5 3z" />
    <path d="M15 3v5h6" />
    <circle cx="10" cy="13" r="0.9" fill="currentColor" />
    <circle cx="14" cy="13" r="0.9" fill="currentColor" />
    <path d="M9.5 16.5c.8.8 2.2.8 3 0" />
  </svg>
);

// identify — magnifier on subject
const Identify = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M21 21l-4.3-4.3" />
    <path d="M11 8v6M8 11h6" />
  </svg>
);

// names — tag/label
const Names = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 12V5a2 2 0 0 0-2-2h-7L3 11l9 9 8-8z" />
    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
  </svg>
);

/**
 * Returns the SVG icon component for a given category slug. Returns a
 * fallback dot if the slug isn't mapped — so the layout never breaks when
 * a new category is added before its icon.
 */
export const CATEGORY_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  captions: Captions,
  ocr: Ocr,
  effects: Effects,
  "text-art": TextArt,
  memes: Memes,
  pet: Pet,
  "alt-text": AltText,
  enhance: Enhance,
  prompts: Prompts,
  utilities: Utilities,
  games: Games,
  stickers: Stickers,
  identify: Identify,
  names: Names,
};

const Fallback = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="6" fill="currentColor" fillOpacity="0.15" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[slug] || Fallback;
  return <Icon className={className} />;
}
