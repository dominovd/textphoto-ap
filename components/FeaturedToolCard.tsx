import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { getCategory } from "@/lib/categories";

export default function FeaturedToolCard({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);
  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className="tool-card group block rounded-2xl bg-white border border-slate-200 overflow-hidden"
    >
      <div
        className={`h-32 bg-gradient-to-br ${category?.gradient ?? "from-slate-500 to-slate-700"} flex items-center justify-center text-white text-5xl`}
      >
        {tool.icon}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {category?.name ?? tool.category}
          </span>
        </div>
        <h3 className="font-semibold mb-1 group-hover:text-brand-700">
          {tool.name}
        </h3>
        <p className="text-sm text-slate-500">{tool.shortDescription}</p>
      </div>
    </Link>
  );
}
