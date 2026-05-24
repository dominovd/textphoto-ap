import Link from "next/link";
import type { Category } from "@/lib/categories";
import { CategoryIcon } from "@/lib/category-icons";
import { getToolIconColors } from "@/lib/tool-icons";

export default function CategoryCard({ category }: { category: Category }) {
  const { bg, fg } = getToolIconColors(category.slug);
  return (
    <Link
      href={`/${category.slug}`}
      className="tool-card group block rounded-2xl p-5 bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition"
    >
      <div
        className={`w-12 h-12 rounded-xl ${bg} ${fg} flex items-center justify-center mb-3 text-[22px] group-hover:scale-105 transition-transform`}
      >
        <CategoryIcon slug={category.slug} />
      </div>
      <h3 className="font-semibold mb-1">{category.name}</h3>
      <p className="text-xs text-slate-500 mb-3">{category.description}</p>
      <span className="text-xs text-brand-600 font-medium">
        {category.count} tools →
      </span>
    </Link>
  );
}
