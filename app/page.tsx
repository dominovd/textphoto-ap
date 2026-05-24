import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/lib/categories";
import { getFeaturedTools, tools } from "@/lib/tools";
import CategoryCard from "@/components/CategoryCard";
import FeaturedToolCard from "@/components/FeaturedToolCard";
import ShowcaseCarousel from "@/components/ShowcaseCarousel";
import PetShowcaseCarousel from "@/components/PetShowcaseCarousel";

export const metadata: Metadata = {
  alternates: { canonical: "https://textphoto.app/" },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://textphoto.app/#organization",
      name: "TextPhoto",
      url: "https://textphoto.app",
      logo: "https://textphoto.app/icon.svg",
      email: "info@textphoto.app",
    },
    {
      "@type": "WebSite",
      "@id": "https://textphoto.app/#website",
      url: "https://textphoto.app",
      name: "TextPhoto",
      description:
        "Free AI tools for photo and text: captions, OCR, text effects, meme makers, alt-text.",
      publisher: { "@id": "https://textphoto.app/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://textphoto.app/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function Home() {
  const featured = getFeaturedTools();
  const totalTools = tools.length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            83 free AI tools · no signup
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            AI tools for <span className="gradient-text">photo</span> +{" "}
            <span className="gradient-text">text</span>.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            Captions, OCR, text effects on images, meme makers, alt-text — all
            free, all in one place. Drop a photo or paste text and get a result
            in seconds.
          </p>

          <form
            action="/search"
            className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-2 flex items-center gap-2"
          >
            <span className="px-3 text-slate-400" aria-hidden>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </span>
            <input
              name="q"
              className="flex-1 bg-transparent outline-none text-sm py-2"
              placeholder="Try 'instagram caption', 'photo to text', 'fire text'…"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium"
            >
              Find tool
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <Link
              href="/captions/instagram-caption-generator"
              className="px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200"
            >
              instagram caption
            </Link>
            <Link
              href="/ocr/image-to-text"
              className="px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200"
            >
              photo to text
            </Link>
            <Link
              href="/effects/neon"
              className="px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200"
            >
              neon text
            </Link>
            <Link
              href="/alt-text/alt-text-generator"
              className="px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200"
            >
              alt text generator
            </Link>
            <Link
              href="/memes/ai-meme-generator"
              className="px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200"
            >
              meme maker
            </Link>
          </div>
        </div>
      </section>

      {/* Showcase carousel — pre-generated AI text effects, click to remix */}
      <ShowcaseCarousel />

      {/* Pet portrait showcase — upload a pet, pick a style */}
      <PetShowcaseCarousel />

      {/* Featured tools — moved above categories per request, most engaging block on the homepage */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Most popular tools
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Hand-picked by what&apos;s blowing up this month
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((t) => (
              <FeaturedToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Browse by category
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              {categories.length} categories · {totalTools}+ tools
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center mono font-bold mb-4">
                01
              </div>
              <h3 className="font-semibold mb-2">Pick a tool</h3>
              <p className="text-slate-400 text-sm">
                Browse 12 categories or search by what you need — captions,
                OCR, effects.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center mono font-bold mb-4">
                02
              </div>
              <h3 className="font-semibold mb-2">
                Drop a photo or paste text
              </h3>
              <p className="text-slate-400 text-sm">
                No account. No upload limit per session.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center mono font-bold mb-4">
                03
              </div>
              <h3 className="font-semibold mb-2">Copy or download</h3>
              <p className="text-slate-400 text-sm">
                PNG, JPG, TXT, or one-click copy. Use it wherever you need.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
