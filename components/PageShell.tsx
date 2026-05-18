import type { ReactNode } from "react";

export default function PageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-slate-600 mb-10">{description}</p>
      )}
      <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-1 [&_a]:text-brand-600 [&_a]:underline hover:[&_a]:no-underline">
        {children}
      </article>
    </div>
  );
}
