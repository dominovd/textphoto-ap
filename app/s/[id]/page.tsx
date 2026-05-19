import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShare } from "@/lib/share-store";
import { getStyle } from "@/lib/text-effect-styles";

export const runtime = "nodejs";
export const revalidate = 3600; // ISR: 1 hour cache for share pages

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const record = await getShare(id);
  if (!record) {
    return { title: "Share not found", robots: { index: false } };
  }
  const style = getStyle(record.styleId);
  const title = `"${record.text}" in ${style?.name || "AI"} style`;
  const description = `AI-generated text effect on textphoto.app. Make your own — type a word, pick a style, free no signup.`;
  const ogUrl = record.url;
  const pageUrl = `https://textphoto.app/s/${id}`;
  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "article",
      images: [{ url: ogUrl, width: 1920, height: 1080, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function SharePage({ params }: { params: Params }) {
  const { id } = await params;
  const record = await getShare(id);
  if (!record) notFound();

  const style = getStyle(record.styleId);
  const remixUrl = `/text-art/ai-text-effect?text=${encodeURIComponent(record.text)}&style=${encodeURIComponent(record.styleId)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/text-art/ai-text-effect" className="hover:text-brand-600">
          AI Text Effect
        </Link>
        <span>/</span>
        <span className="text-slate-900">Shared</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold mb-2">
        &quot;{record.text}&quot;
      </h1>
      <p className="text-slate-600 mb-8">
        Generated in <strong>{style?.name || "AI"}</strong> style on
        TextPhoto. Make your own — free, no signup.
      </p>

      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={record.url}
          alt={`"${record.text}" in ${style?.name || "AI"} style`}
          className="max-w-full max-h-[640px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <Link
          href={remixUrl}
          className="flex-1 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-center"
        >
          Remix with your text →
        </Link>
        <Link
          href="/text-art/ai-text-effect"
          className="py-3 px-6 rounded-xl border border-slate-200 hover:border-brand-300 text-slate-700 font-medium text-center"
        >
          Try a different style
        </Link>
      </div>

      <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold mb-3">About this tool</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-3">
          TextPhoto&apos;s AI Text Effect Generator turns any word into a
          cinematic image — neon signs, gold logos, fire banners, cyberpunk
          glitches, and more. Built on Google&apos;s Nano Banana image model,
          which is the best in class for rendering specific text inside
          generated images.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          The tool is free with daily limits to keep it that way. No sign up.
          Outputs are yours to use.
        </p>
      </div>
    </div>
  );
}
