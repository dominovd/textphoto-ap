import Link from "next/link";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className="tool-card group block rounded-2xl bg-white border border-slate-200 p-5"
    >
      <div className="text-2xl mb-3">{tool.icon}</div>
      <h3 className="font-semibold mb-1 group-hover:text-brand-700">
        {tool.name}
      </h3>
      <p className="text-sm text-slate-500">{tool.shortDescription}</p>
    </Link>
  );
}
