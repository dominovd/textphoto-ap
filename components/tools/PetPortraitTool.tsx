"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  PET_PORTRAIT_STYLES,
  getPetStyle,
  getPetStylePreviewUrl,
} from "@/lib/pet-portrait-styles";

// Outer wrapper — Suspense around useSearchParams() (Next 15 requirement
// for static prerendering).
export default function PetPortraitTool(props: { defaultStyleId?: string }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          Loading…
        </div>
      }
    >
      <PetPortraitInner {...props} />
    </Suspense>
  );
}

function PetPortraitInner({
  defaultStyleId,
}: {
  defaultStyleId?: string;
}) {
  const sp = useSearchParams();
  const urlStyle =
    sp.get("style") || defaultStyleId || PET_PORTRAIT_STYLES[0].id;
  const initialStyle = getPetStyle(urlStyle) || PET_PORTRAIT_STYLES[0];

  const [styleId, setStyleId] = useState<string>(initialStyle.id);
  const [customNotes, setCustomNotes] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [ms, setMs] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const style = getPetStyle(styleId) || PET_PORTRAIT_STYLES[0];

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Photo too large — max 10 MB");
      return;
    }
    setError("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResultUrl("");
  }

  async function onGenerate() {
    if (!file) {
      setError("Upload a photo of your pet first");
      return;
    }
    setLoading(true);
    setError("");
    setResultUrl("");
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("styleId", styleId);
      if (customNotes.trim()) form.append("customNotes", customNotes.trim());
      const res = await fetch("/api/pet-portrait", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setResultUrl(data.url);
      setProvider(data.provider);
      setMs(data.ms);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function onDownload() {
    if (!resultUrl) return;
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `textphoto-pet-${styleId}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, "_blank");
    }
  }

  async function onCopyToolLink() {
    // Share the tool, not the result — generated images live on fal.media (TTL ~hours)
    // so we share the tool URL with the chosen style pre-selected.
    const toolUrl = `https://textphoto.app/pet/ai-pet-portrait-generator?style=${encodeURIComponent(styleId)}`;
    try {
      await navigator.clipboard.writeText(toolUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — older browsers
    }
  }

  async function onNativeShare() {
    if (!resultUrl) return;
    if (
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      typeof navigator.share === "function"
    ) {
      try {
        // Try sharing the file itself (works on iOS/Android with share target)
        const res = await fetch(resultUrl);
        const blob = await res.blob();
        const fileToShare = new File(
          [blob],
          `pet-${styleId}.png`,
          { type: blob.type || "image/png" },
        );
        const nav = navigator as Navigator & {
          canShare?: (data: { files?: File[] }) => boolean;
        };
        if (nav.canShare?.({ files: [fileToShare] })) {
          await navigator.share({
            files: [fileToShare],
            title: `My pet as a ${style.name}`,
            text: "Made with textphoto.app — free AI pet portrait generator",
          });
          return;
        }
        // Fallback: share the tool URL
        await navigator.share({
          title: `My pet as a ${style.name}`,
          text: "Made with textphoto.app",
          url: `https://textphoto.app/pet/ai-pet-portrait-generator?style=${encodeURIComponent(styleId)}`,
        });
      } catch {
        // user cancelled — ignore
      }
    } else {
      await onCopyToolLink();
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <label className="text-sm font-semibold mb-2 block">
          1. Upload your pet&apos;s photo
        </label>
        <label className="block border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-brand-400 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={file?.name || "preview"}
              className="max-h-56 mx-auto rounded-lg"
            />
          ) : (
            <>
              <div className="text-4xl mb-2">🐾</div>
              <p className="text-sm text-slate-600">
                Drop a clear photo of your pet or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Best with a well-lit, eye-level shot · max 10 MB
              </p>
            </>
          )}
        </label>

        <label className="text-sm font-semibold mt-5 mb-3 block">
          2. Pick a style
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-[440px] overflow-y-auto pr-1">
          {PET_PORTRAIT_STYLES.map((s) => {
            const preview = getPetStylePreviewUrl(s.id);
            const isActive = styleId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStyleId(s.id)}
                className={`rounded-lg border text-left overflow-hidden transition ${
                  isActive
                    ? "border-brand-500 ring-2 ring-brand-200"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={`Example: ${s.name}`}
                      loading="lazy"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {s.emoji}
                    </div>
                  )}
                </div>
                <div className={`p-2 ${isActive ? "bg-brand-50" : ""}`}>
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                    <span className="text-base leading-none">{s.emoji}</span>
                    <span className="truncate">{s.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {s.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-semibold text-slate-700 hover:text-brand-600">
            3. Optional: add custom details
          </summary>
          <textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value.slice(0, 200))}
            maxLength={200}
            rows={2}
            placeholder='e.g. "wearing red sunglasses" or "on a beach at sunset"'
            className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
          <p className="text-xs text-slate-400 mt-1">
            {customNotes.length}/200 characters · keep it short and concrete
          </p>
        </details>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={onGenerate}
          disabled={loading || !file}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
        >
          {loading ? "Generating…" : `Generate ${style.name} portrait →`}
        </button>
        <p className="text-xs text-slate-400 mt-2 text-center">
          AI image generation · usually 8-20 sec · limited to 1/hour, 3/day
        </p>
      </div>

      {/* Result */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{style.name} portrait</h3>
        </div>

        {!resultUrl && !loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm text-center px-6">
            Upload a pet photo, pick a style, hit generate.
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm animate-pulse text-center px-6">
            Painting your pet as a {style.name.toLowerCase()}
            …
          </div>
        )}

        {resultUrl && (
          <>
            <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt={`Pet portrait in ${style.name} style`}
                className="max-h-[480px] max-w-full"
              />
            </div>

            {/* Action row */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={onCopyToolLink}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 text-sm text-slate-700"
                title="Copy a link to this tool so friends can try it with their pet"
              >
                {copied ? "✓ Copied!" : "🔗 Copy tool link"}
              </button>
              <button
                onClick={onNativeShare}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 text-sm text-slate-700 sm:hidden"
              >
                Share
              </button>
              <button
                onClick={onDownload}
                className="ml-auto px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium"
              >
                Download PNG
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-400 text-center">
              Generated by {provider} · {(ms / 1000).toFixed(1)}s · download
              within a few hours (image link expires)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
