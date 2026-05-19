"use client";

import { useState } from "react";

export type ImageProcessConfig = {
  endpoint: string;
  icon: string;
  uploadHint: string;
  buttonLabel: string;
  loadingLabel: string;
  resultLabel: string;
  downloadFilename: string;
  /** What the tool does — shown in the input panel as a tip box */
  tip?: string;
  /** Background for the result preview — true for transparent (checkered),
   *  false for plain slate (colored/cartoon results) */
  transparentResult?: boolean;
};

const TRANSPARENT_BG =
  "bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9),linear-gradient(45deg,#f1f5f9_25%,#fff_25%,#fff_75%,#f1f5f9_75%,#f1f5f9)] bg-[size:24px_24px] bg-[position:0_0,12px_12px]";

/**
 * Generic upload → process → result UI for image-to-image tools that
 * don't need additional input options. Used by Colorize, Cartoon, etc.
 */
export default function ImageProcessTool({
  config,
}: {
  config: ImageProcessConfig;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [ms, setMs] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Image too large — max 10 MB");
      return;
    }
    setError("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResultUrl("");
  }

  async function onProcess() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResultUrl("");
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch(config.endpoint, {
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
      a.download = `${config.downloadFilename}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, "_blank");
    }
  }

  const resultBg = config.transparentResult ? TRANSPARENT_BG : "bg-slate-50";

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <label className="text-sm font-semibold mb-3 block">
          1. Upload your photo
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
              className="max-h-72 mx-auto rounded-lg"
            />
          ) : (
            <>
              <div className="text-4xl mb-2">{config.icon}</div>
              <p className="text-sm text-slate-600">
                Drop a photo or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">{config.uploadHint}</p>
            </>
          )}
        </label>

        {config.tip && (
          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
            {config.tip}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={onProcess}
          disabled={loading || !file}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
        >
          {loading ? config.loadingLabel : config.buttonLabel}
        </button>
      </div>

      {/* Output */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{config.resultLabel}</h3>
          {resultUrl && (
            <button
              onClick={onDownload}
              className="text-xs px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium"
            >
              Download PNG
            </button>
          )}
        </div>

        {!resultUrl && !loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm text-center">
            Upload a photo and hit process.
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm animate-pulse text-center">
            {config.loadingLabel}… this may take 20-60 sec.
          </div>
        )}

        {resultUrl && (
          <>
            <div
              className={`flex-1 rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] ${resultBg}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt="Processed result"
                className="max-h-[480px] max-w-full"
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 text-center">
              Processed by {provider} · {(ms / 1000).toFixed(1)}s
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Pre-built configs for the live image-process tools
export const COLORIZE_CONFIG: ImageProcessConfig = {
  endpoint: "/api/colorize",
  icon: "🎨",
  uploadHint: "Black-and-white photos work best",
  buttonLabel: "Colorize →",
  loadingLabel: "Adding colour",
  resultLabel: "Colorized photo",
  downloadFilename: "textphoto-colorized",
  tip: "Best with classic B&W photos. Modern colour photos work too — useful for restoring faded ones.",
  transparentResult: false,
};

export const CARTOON_CONFIG: ImageProcessConfig = {
  endpoint: "/api/cartoon",
  icon: "🎭",
  uploadHint: "Faces, pets, products all work",
  buttonLabel: "Cartoonify →",
  loadingLabel: "Drawing the cartoon",
  resultLabel: "Cartoonified photo",
  downloadFilename: "textphoto-cartoon",
  tip: "AI redraws your photo in cartoon style. Best with clear, well-lit subjects.",
  transparentResult: false,
};
