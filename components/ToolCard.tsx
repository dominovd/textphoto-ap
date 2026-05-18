import Link from "next/link";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className="tool-card group block rounded-2xl bg-white border border-slate-200 p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{tool.icon}</span>
        <span className="text-xs text-slate-400">
          {formatVolume(tool.searchVolume)}/mo
        </span>
      </div>
      <h3 className="font-semibold mb-1 group-hover:text-brand-700">
        {tool.name}
      </h3>
      <p className="text-sm text-slate-500">{tool.shortDescription}</p>
    </Link>
  );
}

function formatVolume(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
  return String(n);
}
