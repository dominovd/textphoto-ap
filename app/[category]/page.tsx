import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getCategory } from "@/lib/categories";
import { getToolsInCategory } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Not found" };
  return {
    title: `${cat.name} — free AI tools`,
    description: cat.description,
    alternates: { canonical: `https://textphoto.app/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const toolsInCat = getToolsInCategory(category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://textphoto.app/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: cat.name,
            item: `https://textphoto.app/${cat.slug}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${cat.name} — Free AI tools`,
        description: cat.description,
        url: `https://textphoto.app/${cat.slug}`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: toolsInCat.length,
          itemListElement: toolsInCat.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://textphoto.app/${t.category}/${t.slug}`,
            name: t.name,
          })),
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900">{cat.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white text-xl`}
            >
              {cat.icon}
            </span>
            <h1 className="text-3xl font-bold">{cat.name}</h1>
          </div>
          <p className="text-slate-600 max-w-2xl">{cat.description}</p>
        </div>
      </div>

      {toolsInCat.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {toolsInCat.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-500 mb-2">More tools coming soon.</p>
          <Link href="/" className="text-brand-600 font-medium hover:underline">
            ← Back to all categories
          </Link>
        </div>
      )}

      <div className="max-w-3xl mt-16 bg-white border border-slate-200 rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-3">About {cat.name.toLowerCase()}</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-3">
          All tools in this category are free and require no account. Pick the
          one that fits your task — most run instantly in your browser.
        </p>
      </div>
    </div>
  );
}
