import Image from "next/image";
import Link from "next/link";
import {
  PET_PORTRAIT_STYLES,
  getPetStylePreviewUrl,
} from "@/lib/pet-portrait-styles";

/**
 * Pre-generated showcase carousel for the AI Pet Portrait Generator.
 *
 * Lives on the homepage alongside the text-effect showcase. Each card links
 * to the pet portrait generator with the style pre-selected so the user can
 * upload their own pet's photo and remix.
 *
 * Performance:
 *   - Pure CSS scroll-snap (no JS carousel lib)
 *   - Next.js Image with priority on first 2 cards
 *   - Emoji-on-gradient fallback for styles that haven't been seeded yet
 */

export default function PetShowcaseCarousel() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-amber-50/40 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Turn your pet into anything 🐾
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Upload one photo of your pet → pick a style. Free, no signup.
            </p>
          </div>
          <Link
            href="/pet/ai-pet-portrait-generator"
            className="hidden sm:inline text-brand-600 text-sm font-medium hover:underline"
          >
            All pet styles →
          </Link>
        </div>

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
            {PET_PORTRAIT_STYLES.map((style, idx) => {
              const previewUrl = getPetStylePreviewUrl(style.id);
              return (
                <Link
                  key={style.id}
                  href={`/pet/ai-pet-portrait-generator?style=${encodeURIComponent(style.id)}`}
                  className="
                    snap-start shrink-0 w-[280px] sm:w-[320px]
                    rounded-xl overflow-hidden border border-slate-200
                    hover:border-brand-300 hover:shadow-lg transition
                    bg-white group
                  "
                >
                  <div className="aspect-[16/9] relative bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 overflow-hidden">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt={`Pet portrait — ${style.name} style`}
                        width={600}
                        height={340}
                        priority={idx < 2}
                        loading={idx < 2 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 280px, 320px"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      // Fallback while showcase isn't seeded yet — big emoji on
                      // gradient background. Cards still look polished.
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="text-6xl mb-1 group-hover:scale-110 transition-transform duration-300">
                          {style.emoji}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Upload your pet
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      <span>{style.name}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {style.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
