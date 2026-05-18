import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/lib/categories";
import { getTool, getToolsInCategory, tools } from "@/lib/tools";
import InstagramCaptionTool from "@/components/tools/InstagramCaptionTool";
import OCRTool from "@/components/tools/OCRTool";
import NeonTextTool from "@/components/tools/NeonTextTool";

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

function renderTool(componentKey: string | null) {
  switch (componentKey) {
    case "instagram-caption":
      return <InstagramCaptionTool />;
    case "ocr":
      return <OCRTool />;
    case "neon":
      return <NeonTextTool />;
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
      <div className="mb-12">{renderTool(t.component)}</div>

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
          <div className="bg-gradient-to-br from-brand-500 to-pink-500 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2 text-sm">Want this as an API?</h3>
            <p className="text-xs opacity-90 mb-3">
              We&apos;ll send early access when our API launches.
            </p>
            <input
              className="w-full px-3 py-2 rounded-lg text-slate-900 text-sm"
              placeholder="you@email.com"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
