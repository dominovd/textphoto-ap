import Image from "next/image";
import Link from "next/link";

/**
 * Pre-generated showcase carousel for the homepage hero.
 *
 * Performance:
 *   - Pure CSS scroll-snap (no JS carousel lib = 0 KB extra bundle)
 *   - Next.js Image with `priority` only on the first 2 cards (above fold);
 *     the rest lazy-load via IntersectionObserver
 *   - WebP at 600×340, ~30-50 KB per image (12 cards ≈ 400 KB total)
 *   - `sizes` lets the browser pick the right variant for the viewport
 *
 * Each card → /text-art/ai-text-effect?style=X&text=Y (remix-ready).
 */

type ShowcaseItem = {
  styleId: string;
  text: string;
  label: string; // human-readable style name
};

// Account-specific Blob domain. Files seeded May 2026 via /api/showcase-upload.
// To re-seed: bump image-gen limits, run the in-browser script, re-upload.
const BLOB_BASE =
  "https://0sbqqt82hdpagq0d.public.blob.vercel-storage.com";

const ITEMS: ShowcaseItem[] = [
  { styleId: "realistic-fire", text: "BLAZE", label: "Realistic Fire" },
  { styleId: "blue-flame", text: "IGNITE", label: "Blue Flame" },
  { styleId: "heavy-metal", text: "INFERNO", label: "Heavy Metal" },
  { styleId: "neon-sign", text: "OPEN", label: "Neon Sign" },
  { styleId: "3d-gold", text: "VICTORY", label: "3D Gold" },
  { styleId: "cyberpunk", text: "SYSTEM", label: "Cyberpunk" },
  { styleId: "gaming-banner", text: "WINNER", label: "Gaming Banner" },
  { styleId: "horror-cursed", text: "CURSED", label: "Horror" },
  { styleId: "holographic", text: "AURA", label: "Holographic" },
  { styleId: "stone-carving", text: "LEGEND", label: "Stone Carving" },
  { styleId: "youtube-thumbnail", text: "INSANE", label: "YouTube Thumbnail" },
  { styleId: "minimalist-logo", text: "BRAND", label: "Minimalist Logo" },
];

export default function ShowcaseCarousel() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Type a word, get a cinematic image
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Click any style to remix it with your own text · free, no signup
            </p>
          </div>
          <Link
            href="/text-art/ai-text-effect"
            className="hidden sm:inline text-brand-600 text-sm font-medium hover:underline"
          >
            All styles →
          </Link>
        </div>

        {/* CSS scroll-snap carousel — horizontal swipe on mobile, scroll on desktop */}
        <div className="relative">
          <div
            className="
              flex gap-4 overflow-x-auto snap-x snap-mandatory
              pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6
              [scrollbar-width:thin]
              [&::-webkit-scrollbar]:h-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-slate-200
              [&::-webkit-scrollbar-thumb]:rounded-full
            "
          >
            {ITEMS.map((item, idx) => (
              <Link
                key={item.styleId}
                href={`/text-art/ai-text-effect?style=${encodeURIComponent(item.styleId)}&text=${encodeURIComponent(item.text)}`}
                className="
                  snap-start shrink-0 w-[280px] sm:w-[320px]
                  rounded-xl overflow-hidden border border-slate-200
                  hover:border-brand-300 hover:shadow-lg transition
                  bg-white group
                "
              >
                <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden">
                  <Image
                    src={`${BLOB_BASE}/showcase/${item.styleId}.webp`}
                    alt={`"${item.text}" in ${item.label} style`}
                    width={600}
                    height={340}
                    priority={idx < 2}
                    loading={idx < 2 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-slate-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Click to remix &quot;{item.text}&quot;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
