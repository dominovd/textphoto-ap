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
  return {
    title: `${t.name} — Free, no signup`,
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
          <p className="text-slate-600 max-w-2xl">{t.shortDescription}</p>
        </div>
      </div>

      {/* Actual tool */}
      <div className="mb-12">{renderTool(t.component, t.slug)}</div>

      {/* SEO content + related */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold mb-3">
            How the {t.name} works
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            {t.longDescription}
          </p>

          <h3 className="font-semibold mt-6 mb-3">FAQ</h3>
          {t.faq.map((f, i) => (
            <details
              key={i}
              className="text-sm text-slate-600 mb-2 border-b border-slate-100 pb-2"
            >
              <summary className="cursor-pointer font-medium text-slate-900">
                {f.q}
              </summary>
              <p className="mt-2">{f.a}</p>
            </details>
          ))}
        </div>

        <aside className="space-y-4">
          {related.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold mb-3 text-sm">Related tools</h3>
              <ul className="space-y-2 text-sm">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/${r.category}/${r.slug}`}
                      className="text-brand-600 hover:underline"
                    >
                      → {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
