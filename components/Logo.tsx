import Link from "next/link";

/**
 * textphoto.app brand mark — a polaroid silhouette with a bold "T" inside
 * (the letter is the "text", the polaroid is the "photo"). Rendered inside
 * a rounded gradient square so the icon reads clearly at favicon sizes.
 *
 * Usage:
 *   <Logo />                  → icon + wordmark, default md size, linked to /
 *   <Logo size="sm" />        → smaller (for footer)
 *   <Logo iconOnly />         → just the gradient square, no wordmark
 *   <Logo asLink={false} />   → render plain (e.g. inside another anchor)
 */
export default function Logo({
  size = "md",
  iconOnly = false,
  asLink = true,
}: {
  size?: "sm" | "md";
  iconOnly?: boolean;
  asLink?: boolean;
}) {
  const boxClass = size === "sm" ? "w-8 h-8 rounded-lg" : "w-9 h-9 rounded-xl";
  const svgSize = size === "sm" ? 22 : 26;
  const wordClass = size === "sm" ? "font-bold text-sm" : "font-bold text-lg";

  const content = (
    <span className="flex items-center gap-2">
      <span
        className={`${boxClass} bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center shadow-sm`}
      >
        <PolaroidT size={svgSize} />
      </span>
      {!iconOnly && (
        <span className={wordClass}>
          textphoto<span className="text-brand-600">.app</span>
        </span>
      )}
    </span>
  );

  if (!asLink) return content;
  return (
    <Link href="/" aria-label="textphoto.app — home" className="inline-flex">
      {content}
    </Link>
  );
}

/**
 * The polaroid + T mark itself. Used inside `<Logo />` and re-used by
 * `app/apple-icon.tsx` for the favicon — keeping a single source of truth.
 */
export function PolaroidT({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      {/* Polaroid card (white) */}
      <rect x="7" y="6" width="18" height="22" rx="2.2" fill="white" />
      {/* Bottom "developing" strip — gradient to suggest a photo */}
      <defs>
        <linearGradient id="tp-strip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect
        x="9.5"
        y="20"
        width="13"
        height="5.5"
        rx="0.8"
        fill="url(#tp-strip)"
      />
      {/* Bold T inside the polaroid frame */}
      <path
        d="M11 9h10M16 9v9"
        stroke="#7c3aed"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
