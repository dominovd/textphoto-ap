"use client";

import { useState } from "react";
import { UploadAffordance } from "@/lib/tool-icons";

export default function UpscaleTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [ms, setMs] = useState<number>(0);
  const [scale, setScale] = useState<2 | 4>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [originalDims, setOriginalDims] = useState<string>("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Image too large — max 10 MB");
      return;
    }
    setError("");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setResultUrl("");
    // Get dimensions
    const img = new Image();
    img.onload = () => setOriginalDims(`${img.naturalWidth}×${img.naturalHeight}`);
    img.src = url;
  }

  async function onUpscale() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResultUrl("");
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("scale", String(scale));
      const res = await fetch("/api/upscale", { method: "POST", body: form });
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
      a.download = `textphoto-upscaled-${scale}x-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, "_blank");
    }
  }

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
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={file?.name || "preview"}
                className="max-h-56 mx-auto rounded-lg"
              />
              {originalDims && (
                <p className="text-xs text-slate-500 mt-2">{originalDims}</p>
              )}
            </>
          ) : (
            <>
              <UploadAffordance />
              <p className="text-sm text-slate-600">
                Drop a photo or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Up to 10 MB. Works best with small or blurry images.
              </p>
            </>
          )}
        </label>

        <label className="text-sm font-semibold mt-6 mb-3 block">
          2. Upscale factor
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setScale(2)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium ${
              scale === 2
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            2× (faster)
          </button>
          <button
            onClick={() => setScale(4)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium ${
              scale === 4
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            4× (sharper)
          </button>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900">Tip:</strong> 2× is good for most
          uploads and finishes in ~5-10 sec. 4× is better for very small or
          blurry inputs but takes 15-30 sec.
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={onUpscale}
          disabled={loading || !file}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
        >
          {loading ? `Upscaling ${scale}×…` : `Upscale ${scale}× →`}
        </button>
      </div>

      {/* Output */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Upscaled result</h3>
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
            Upload a photo, pick scale, hit upscale.
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm animate-pulse text-center">
            Adding pixels…{scale === 4 ? " 4× takes 15-30 sec, hang tight." : ""}
          </div>
        )}

        {resultUrl && (
          <>
            <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt={`Upscaled ${scale}x`}
                className="max-h-[480px] max-w-full"
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 text-center">
              Processed by {provider} · {(ms / 1000).toFixed(1)}s · {scale}×
            </p>
          </>
        )}
      </div>
    </div>
  );
}
