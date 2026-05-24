"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Tool } from "@/lib/tools";

type CategoryLite = { slug: string; name: string; gradient: string };
type SortKey = "popular" | "alpha";

export default function SearchClient({
  allTools,
  allCategories,
}: {
  allTools: Tool[];
  allCategories: CategoryLite[];
}) {
  const sp = useSearchParams();
  const initialQ = sp.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [onlyWorking, setOnlyWorking] = useState(false);

  // sync URL ?q=
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = allTools.filter((t) => {
      if (categoryFilter !== "all" && t.category !== categoryFilter)
        return false;
      if (onlyWorking && !t.component) return false;
      if (!q) return true;
      const blob = `${t.name} ${t.shortDescription} ${t.longDescription} ${t.category}`.toLowerCase();
      return blob.includes(q);
    });
    res =
      sort === "popular"
        ? [...res].sort((a, b) => b.searchVolume - a.searchVolume)
        : [...res].sort((a, b) => a.name.localeCompare(b.name));
    return res;
  }, [allTools, query, categoryFilter, sort, onlyWorking]);

  const categoryByslug = useMemo(() => {
    const m: Record<string, CategoryLite> = {};
    for (const c of allCategories) m[c.slug] = c;
    return m;
  }, [allCategories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Search tools</h1>
      <p className="text-slate-500 text-sm mb-8">
        {allTools.length} tools across {allCategories.length} categories
      </p>

      {/* Search bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-2 mb-6">
        <svg
          className="w-5 h-5 ml-2 text-slate-400"
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
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, keyword, or category…"
          className="flex-1 bg-transparent outline-none text-base py-2"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="px-2 py-1 text-xs text-slate-400 hover:text-slate-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
        >
          <option value="all">All categories</option>
          {allCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
        >
          <option value="popular">Sort: Popular</option>
          <option value="alpha">Sort: A → Z</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyWorking}
            onChange={(e) => setOnlyWorking(e.target.checked)}
            className="accent-brand-600"
          />
          Only launched tools
        </label>

        <span className="ml-auto text-xs text-slate-500">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-700 font-medium mb-2">No tools found</p>
          <p className="text-slate-500 text-sm mb-4">
            Try a different keyword or browse{" "}
            <Link href="/" className="text-brand-600 hover:underline">
              all categories
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => {
            const cat = categoryByslug[t.category];
            return (
              <Link
                key={`${t.category}/${t.slug}`}
                href={`/${t.category}/${t.slug}`}
                className="tool-card group block rounded-2xl bg-white border border-slate-200 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{t.icon}</span>
                  {t.component && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                      Live
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-brand-700">
                  {t.name}
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  {t.shortDescription}
                </p>
                {cat && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full bg-gradient-to-br ${cat.gradient}`}
                    />
                    {cat.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
