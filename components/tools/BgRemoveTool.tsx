"use client";

import { useState } from "react";
import { UploadAffordance } from "@/lib/tool-icons";

const TRANSPARENT_BG =
  "bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9),linear-gradient(45deg,#f1f5f9_25%,#fff_25%,#fff_75%,#f1f5f9_75%,#f1f5f9)] bg-[size:24px_24px] bg-[position:0_0,12px_12px]";

export default function BgRemoveTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [ms, setMs] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [bgStyle, setBgStyle] = useState<"transparent" | "white" | "black">(
    "transparent",
  );

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

  async function onRemove() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResultUrl("");
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/bg-remove", {
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
      a.download = `textphoto-no-bg-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(resultUrl, "_blank");
    }
  }

  const bgClass =
    bgStyle === "transparent"
      ? TRANSPARENT_BG
      : bgStyle === "white"
        ? "bg-white"
        : "bg-slate-900";

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
              <UploadAffordance />
              <p className="text-sm text-slate-600">
                Drop a photo or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Best with clear subject on contrasting background
              </p>
            </>
          )}
        </label>

        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900">Works on:</strong> people,
          products, animals, food, objects. Output is a transparent PNG you can
          drop into any design.
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={onRemove}
          disabled={loading || !file}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
        >
          {loading ? "Removing background…" : "Remove background →"}
        </button>
      </div>

      {/* Output */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Result</h3>
          {resultUrl && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setBgStyle("transparent")}
                  className={`px-2 py-1 rounded border ${bgStyle === "transparent" ? "border-brand-500 text-brand-700" : "border-slate-200 text-slate-500"}`}
                >
                  ▦
                </button>
                <button
                  onClick={() => setBgStyle("white")}
                  className={`px-2 py-1 rounded border ${bgStyle === "white" ? "border-brand-500 text-brand-700" : "border-slate-200 text-slate-500"}`}
                >
                  ⬜
                </button>
                <button
                  onClick={() => setBgStyle("black")}
                  className={`px-2 py-1 rounded border ${bgStyle === "black" ? "border-brand-500 text-brand-700" : "border-slate-200 text-slate-500"}`}
                >
                  ⬛
                </button>
              </div>
              <button
                onClick={onDownload}
                className="text-xs px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium"
              >
                Download PNG
              </button>
            </div>
          )}
        </div>

        {!resultUrl && !loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm text-center">
            Upload a photo and hit Remove.
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm animate-pulse">
            Erasing the background…
          </div>
        )}

        {resultUrl && (
          <>
            <div
              className={`flex-1 rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] ${bgClass}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt="Background removed"
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
