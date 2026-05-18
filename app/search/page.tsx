import type { Metadata } from "next";
import { Suspense } from "react";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search tools",
  description:
    "Search all free AI tools on TextPhoto — captions, OCR, text effects, alt-text, meme makers, and more.",
  alternates: { canonical: "https://textphoto.app/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-slate-400">
          Loading…
        </div>
      }
    >
      <SearchClient
        allTools={tools}
        allCategories={categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          gradient: c.gradient,
        }))}
      />
    </Suspense>
  );
}
