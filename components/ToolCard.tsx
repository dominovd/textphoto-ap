import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { ToolIcon, getToolIconColors } from "@/lib/tool-icons";

export default function ToolCard({ tool }: { tool: Tool }) {
  const { bg, fg } = getToolIconColors(tool.category);
  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className="tool-card group block rounded-2xl bg-white border border-slate-200 p-5 hover:border-brand-300 hover:shadow-md transition"
    >
      <div
        className={`w-11 h-11 rounded-xl ${bg} ${fg} flex items-center justify-center mb-3 text-[20px] group-hover:scale-105 transition-transform`}
      >
        <ToolIcon slug={tool.slug} />
      </div>
      <h3 className="font-semibold mb-1 group-hover:text-brand-700">
        {tool.name}
      </h3>
      <p className="text-sm text-slate-500">{tool.shortDescription}</p>
    </Link>
  );
}
