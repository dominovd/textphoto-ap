import Image from "next/image";
import Link from "next/link";
import type { RichContent } from "@/lib/rich-content";

/**
 * Premium tool landing page sections — for tools that have a rich-content
 * entry in lib/rich-content.ts. Mirrors the structure proven on competitor
 * tool pages: gallery + how it works + why use + use cases + pro tips + CTA.
 */

export default function RichToolContent({
  content,
}: {
  content: RichContent;
}) {
  return (
    <div className="mt-16 space-y-20">
      {content.gallery && <GallerySection gallery={content.gallery} />}
      <HowItWorksSection data={content.howItWorks} />
      <WhyUseSection data={content.whyUse} />
      <UseCasesSection data={content.useCases} />
      <ProTipsSection data={content.proTips} />
      <CtaSection data={content.cta} />
    </div>
  );
}

// -----------------------------------------------------------------------------

function GallerySection({
  gallery,
}: {
  gallery: NonNullable<RichContent["gallery"]>;
}) {
  return (
    <section>
      <SectionHeader title={gallery.title} subtitle={gallery.subtitle} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {gallery.items.map((item, i) => (
          <figure
            key={i}
            className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition"
          >
            <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {item.caption && (
              <figcaption className="p-3 text-xs text-slate-600 font-medium border-t border-slate-100">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------

function HowItWorksSection({
  data,
}: {
  data: RichContent["howItWorks"];
}) {
  return (
    <section>
      <SectionHeader title={data.title} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.steps.map((step, i) => (
          <div
            key={i}
            className="relative bg-white rounded-2xl border border-slate-200 p-6"
          >
            <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-xs font-bold">
              Step {i + 1}
            </div>
            <div className="text-4xl mb-3">{step.emoji}</div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------

function WhyUseSection({ data }: { data: RichContent["whyUse"] }) {
  return (
    <section>
      <SectionHeader title={data.title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-brand-300 transition"
          >
            <div className="text-3xl mb-3">{f.emoji}</div>
            <h3 className="font-semibold mb-1.5">{f.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------

function UseCasesSection({
  data,
}: {
  data: RichContent["useCases"];
}) {
  return (
    <section>
      <SectionHeader title={data.title} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.items.map((u, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-6"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="shrink-0 w-7 h-7 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </div>
              <h3 className="font-semibold flex-1">{u.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3 pl-10">
              {u.description}
            </p>
            {u.examplePrompt && (
              <div className="ml-10 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed">
                {u.examplePrompt}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------

/**
 * Renders the pro-tips list. Supports inline **bold** segments by splitting
 * each tip on the `**…**` markers without pulling in a markdown library.
 */
function ProTipsSection({
  data,
}: {
  data: RichContent["proTips"];
}) {
  return (
    <section>
      <SectionHeader title={data.title} />
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <ul className="space-y-4">
          {data.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[11px] font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {renderInlineBold(tip)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function renderInlineBold(text: string): React.ReactNode[] {
  // Split on **…**; even-indexed parts are plain text, odd-indexed are bold.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-slate-900">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// -----------------------------------------------------------------------------

function CtaSection({ data }: { data: RichContent["cta"] }) {
  return (
    <section>
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {data.headline}
        </h2>
        <p className="text-brand-100 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
          {data.subline}
        </p>
        <Link
          href="#tool-top"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold text-sm hover:bg-brand-50 transition"
        >
          {data.buttonLabel || "Try it now →"}
        </Link>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 text-center max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
    </div>
  );
}
