"use client";

import { useMemo, useState } from "react";
import { getEffect } from "@/lib/effects";

export default function TextEffectTool({ slug }: { slug: string }) {
  const config = getEffect(slug);

  const [text, setText] = useState(config?.defaultText || "");
  const [presetIdx, setPresetIdx] = useState(0);
  const [bgIdx, setBgIdx] = useState(config?.defaultBg ?? 0);
  const [size, setSize] = useState(config?.defaultSize || 80);

  const preview = useMemo(() => {
    if (!config) return null;
    const preset = config.presets[presetIdx];
    return {
      style: {
        ...preset.style,
        fontSize: `${size}px`,
        lineHeight: 1.1,
        fontWeight: config.fontWeight,
        fontFamily: config.fontFamily,
        textTransform: config.textTransform,
        letterSpacing: config.letterSpacing,
        wordBreak: "break-word" as const,
      },
    };
  }, [config, presetIdx, bgIdx, size]);

  if (!config || !preview) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <p className="text-slate-500 text-sm">Effect config missing.</p>
      </div>
    );
  }

  const bg = config.backgrounds[bgIdx];

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
                className="inline-block w-4 h-4 rounded-full"
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
          onClick={() => window.print()}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold"
        >
          Print / Save as PDF
        </button>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Or right-click preview → Save Image (PNG export coming soon)
        </p>
      </div>

      {/* Preview */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 overflow-hidden">
        <div
          className={`${bg.className} min-h-[480px] flex items-center justify-center p-8`}
        >
          <span style={preview.style} className="text-center">
            {text || config.defaultText}
          </span>
        </div>
      </div>
    </div>
  );
}
