"use client";

import { useMemo, useRef, useState } from "react";
import { getEffect } from "@/lib/effects";

export default function TextEffectTool({ slug }: { slug: string }) {
  const config = getEffect(slug);

  const [text, setText] = useState(config?.defaultText || "");
  const [presetIdx, setPresetIdx] = useState(0);
  const [bgIdx, setBgIdx] = useState(config?.defaultBg ?? 0);
  const [size, setSize] = useState(config?.defaultSize || 80);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);

  const preview = useMemo(() => {
    if (!config) return null;
    const preset = config.presets[presetIdx];
    return {
      style: {
        ...preset.style,
        display: "inline-block" as const,
        fontSize: `${size}px`,
        lineHeight: 1.1,
        fontWeight: config.fontWeight,
        fontFamily: config.fontFamily,
        textTransform: config.textTransform,
        letterSpacing: config.letterSpacing,
        wordBreak: "break-word" as const,
        padding: "0.1em 0.05em",
      },
    };
  }, [config, presetIdx, size]);

  if (!config || !preview) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <p className="text-slate-500 text-sm">Effect config missing.</p>
      </div>
    );
  }

  const bg = config.backgrounds[bgIdx];
  const isTransparent = bg.name === "Transparent";

  async function onDownload() {
    if (!previewRef.current) return;
    setDownloading(true);
    setDownloadError("");
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: isTransparent ? undefined : undefined,
        // If transparent: don't paint a backdrop; otherwise the bg element provides it
        skipFonts: false,
      });
      const link = document.createElement("a");
      link.download = `textphoto-${slug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      setDownloadError(
        e instanceof Error ? e.message : "Download failed. Try again.",
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <label className="text-sm font-semibold mb-2 block">Your text</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 32))}
          maxLength={32}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-base mb-1"
          placeholder="Type something…"
        />
        <p className="text-xs text-slate-400 mb-5">
          {text.length}/32 characters
        </p>

        <label className="text-sm font-semibold mb-2 block">Style</label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {config.presets.map((pr, i) => (
            <button
              key={pr.name}
              onClick={() => setPresetIdx(i)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 ${
                presetIdx === i ? "border-brand-500" : "border-slate-200"
              }`}
            >
              <span
                className="inline-block w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: pr.swatch }}
              />
              <span className="text-left">{pr.name}</span>
            </button>
          ))}
        </div>

        <label className="text-sm font-semibold mb-2 block">Background</label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {config.backgrounds.map((bgo, i) => (
            <button
              key={bgo.name}
              onClick={() => setBgIdx(i)}
              className={`p-2 rounded-lg border text-xs font-medium ${
                bgIdx === i ? "border-brand-500" : "border-slate-200"
              }`}
            >
              {bgo.name}
            </button>
          ))}
        </div>

        <label className="text-sm font-semibold mb-2 block">
          Size ({size}px)
        </label>
        <input
          type="range"
          min={config.minSize}
          max={config.maxSize}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full accent-brand-600"
        />

        <button
          onClick={onDownload}
          disabled={downloading}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
        >
          {downloading ? "Generating PNG…" : "Download as PNG"}
        </button>
        {downloadError && (
          <p className="text-xs text-red-600 mt-2 text-center">
            {downloadError}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-2 text-center">
          High-resolution 2x PNG · transparent or with background
        </p>
      </div>

      {/* Preview */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 overflow-hidden">
        <div
          ref={previewRef}
          className={`${bg.className} min-h-[480px] flex items-center justify-center p-8`}
        >
          {/* key forces full re-mount on preset change — avoids stale style state from previous preset */}
          <span
            key={`${slug}-${presetIdx}`}
            style={preview.style}
            className="text-center"
          >
            {text || config.defaultText}
          </span>
        </div>
      </div>
    </div>
  );
}
