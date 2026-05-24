import Image from "next/image";
import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { getCategory } from "@/lib/categories";
import { ToolIcon, getToolIconColors } from "@/lib/tool-icons";

export default function FeaturedToolCard({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);
  const { bg, fg } = getToolIconColors(tool.category);
  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className="tool-card group block rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-brand-300 hover:shadow-md transition"
    >
      {tool.previewImage ? (
        // Real-image hero — used for premium tools where we have a generated example.
        <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
          <Image
            src={tool.previewImage}
            alt={`Example from ${tool.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        // Fallback — duotone icon centered on a pastel category backdrop.
        <div
          className={`aspect-[16/9] ${bg} ${fg} flex items-center justify-center text-[64px] group-hover:scale-105 transition-transform duration-300`}
        >
          <ToolIcon slug={tool.slug} />
        </div>
      )}
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
