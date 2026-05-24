import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/lib/categories";
import {
  getTool,
  getToolsInCategory,
  tools,
  getCaptionPlatform,
} from "@/lib/tools";
import PhotoCaptionTool from "@/components/tools/PhotoCaptionTool";
import OCRTool from "@/components/tools/OCRTool";
import TextEffectTool from "@/components/tools/TextEffectTool";
import AltTextTool from "@/components/tools/AltTextTool";
import MemeTool from "@/components/tools/MemeTool";
import BgRemoveTool from "@/components/tools/BgRemoveTool";
import UpscaleTool from "@/components/tools/UpscaleTool";
import InstagramBioTool from "@/components/tools/InstagramBioTool";
import ImageProcessTool, {
  COLORIZE_CONFIG,
  CARTOON_CONFIG,
} from "@/components/tools/ImageProcessTool";
import AiTextEffectTool from "@/components/tools/AiTextEffectTool";
import { TEXT_EFFECT_STYLES } from "@/lib/text-effect-styles";
import PetPortraitTool from "@/components/tools/PetPortraitTool";
import { PET_PORTRAIT_STYLES } from "@/lib/pet-portrait-styles";
import AiImageEditorTool from "@/components/tools/AiImageEditorTool";
import RichToolContent from "@/components/RichToolContent";
import { getRichContent } from "@/lib/rich-content";

export function generateStaticParams() {
  return tools.map((t) => ({ category: t.category, tool: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}): Promise<Metadata> {
  const { category, tool } = await params;
  const t = getTool(category, tool);
  if (!t) return { title: "Not found" };
  // For AI tools the name already starts with "Free AI …", so we just append
  // the brand. CSS-only tools keep their original short name and get an
  // explanatory suffix instead.
  const isAiTool = t.name.startsWith("Free AI ");
  const title = isAiTool
    ? `${t.name} | TextPhoto`
    : `${t.name} — Free, no signup`;
  return {
    title,
    description: t.shortDescription,
    alternates: {
      canonical: `https://textphoto.app/${t.category}/${t.slug}`,
    },
    openGraph: {
      title: t.name,
      description: t.shortDescription,
      url: `https://textphoto.app/${t.category}/${t.slug}`,
    },
  };
}

function renderTool(componentKey: string | null, slug: string) {
  switch (componentKey) {
    case "photo-caption":
      return <PhotoCaptionTool platform={getCaptionPlatform(slug)} />;
    case "ocr":
      // Slug-based routing: OCRTool handles 3 modes via mode prop
      if (slug === "handwriting-to-text") return <OCRTool mode="handwriting" />;
      if (slug === "translate-from-photo") return <OCRTool mode="translate" />;
      return <OCRTool mode="default" />;
    case "text-effect":
      return <TextEffectTool slug={slug} />;
    case "alt-text":
      return <AltTextTool />;
    case "meme":
      return <MemeTool />;
    case "bg-remove":
      return <BgRemoveTool />;
    case "upscale":
      return <UpscaleTool />;
    case "colorize":
      return <ImageProcessTool config={COLORIZE_CONFIG} />;
    case "cartoon":
      return <ImageProcessTool config={CARTOON_CONFIG} />;
    case "instagram-bio":
      return <InstagramBioTool />;
    case "ai-text-effect": {
      // Use-case landing pages: lookup style whose seoSlug matches the tool slug.
      // Falls back to undefined for the generic /text-art/ai-text-effect page.
      const presetStyle = TEXT_EFFECT_STYLES.find((s) => s.seoSlug === slug);
      return <AiTextEffectTool defaultStyleId={presetStyle?.id} />;
    }
    case "pet-portrait": {
      // Use-case landing pages: lookup pet style whose seoSlug matches the tool slug.
      const presetStyle = PET_PORTRAIT_STYLES.find((s) => s.seoSlug === slug);
      return <PetPortraitTool defaultStyleId={presetStyle?.id} />;
    }
    case "ai-image-edit":
      return <AiImageEditorTool />;
    default:
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
          <p className="text-slate-700 font-medium mb-2">
            This tool is on our roadmap
          </p>
          <p className="text-slate-500 text-sm">
            We&apos;re shipping it soon. In the meantime, try our launched
            tools below.
          </p>
        </div>
      );
  }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}) {
  const { category, tool } = await params;
  const t = getTool(category, tool);
  if (!t) notFound();

  const cat = getCategory(category);
  const related = getToolsInCategory(category)
    .filter((x) => x.slug !== t.slug)
    .slice(0, 5);
  const richContent = getRichContent(t.slug);

  // JSON-LD: BreadcrumbList + SoftwareApplication + FAQPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://textphoto.app/" },
          {
            "@type": "ListItem",
            position: 2,
            name: cat?.name ?? t.category,
            item: `https://textphoto.app/${t.category}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: t.name,
            item: `https://textphoto.app/${t.category}/${t.slug}`,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: t.name,
        description: t.shortDescription,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: `https://textphoto.app/${t.category}/${t.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span>/</span>
        <Link href={`/${t.category}`} className="hover:text-brand-600">
          {cat?.name ?? t.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900">{t.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row items-start gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t.name}</h1>
          <p className="text-slate-600 max-w-2xl">
            {richContent?.heroSubtitle ?? t.shortDescription}
          </p>
        </div>
      </div>

      {/* Actual tool — id is the anchor target for the CTA button at the bottom */}
      <div id="tool-top" className="mb-12 scroll-mt-20">
        {renderTool(t.component, t.slug)}
      </div>

      {/* Premium rich content sections (only for tools registered in lib/rich-content.ts) */}
      {richContent && <RichToolContent content={richContent} />}

      {/* Intro paragraph (only for tools without rich content) */}
      {!richContent && (
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold mb-3">How the {t.name} works</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t.longDescription}
          </p>
        </div>
      )}

      {/* FAQ — Pixelbin-style pill accordion */}
      <section className="mt-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Frequently asked questions
          </h2>
          <p className="text-slate-500 text-sm">
            Everything you need to know about the {t.name}. Still stuck? Email
            us at{" "}
            <a
              href="mailto:info@textphoto.app"
              className="text-brand-600 hover:underline"
            >
              info@textphoto.app
            </a>
            .
          </p>
        </div>
        <div className="space-y-3">
          {t.faq.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition open:border-brand-300 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 p-5">
                <span className="font-medium text-slate-900 text-sm sm:text-base">
                  {f.q}
                </span>
                <span className="shrink-0 w-7 h-7 rounded-full bg-slate-100 group-open:bg-brand-100 flex items-center justify-center transition">
                  <svg
                    className="w-4 h-4 text-slate-500 group-open:text-brand-700 group-open:rotate-45 transition-transform duration-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related tools — full-width card grid */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              More AI tools in {cat?.name ?? t.category}
            </h2>
            <p className="text-slate-500 text-sm">
              Free, no signup — try a different one next.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.category}/${r.slug}`}
                className="group block rounded-2xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition p-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat?.gradient ?? "from-slate-500 to-slate-700"} flex items-center justify-center text-white text-xl mb-3 shadow-sm group-hover:scale-105 transition-transform`}
                >
                  {r.icon}
                </div>
                <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:text-brand-700">
                  {r.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {r.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
