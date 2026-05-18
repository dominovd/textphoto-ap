"use client";

import { useState } from "react";

type Variant = {
  name: string;
  label: string;
  text: string;
  chars: number;
};

export default function AltTextTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

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
    setVariants([]);
  }

  async function onGenerate() {
    if (!file) return;
    setLoading(true);
    setError("");
    setVariants([]);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/alt-text", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setVariants(data.variants || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <label className="text-sm font-semibold mb-3 block">
          Upload your image
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
              <div className="text-4xl mb-2">♿</div>
              <p className="text-sm text-slate-600">
                Drop an image or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Any image — product, hero shot, infographic, screenshot
              </p>
            </>
          )}
        </label>

        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900">Why alt text matters:</strong>{" "}
          Screen readers describe images to blind and low-vision users; search
          engines use alt text to understand what your image shows. Good alt
          text helps both.
        </div>

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
          {loading ? "Generating…" : "Generate alt text →"}
        </button>
      </div>

      {/* Output */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">3 alt text variants</h3>
          {variants.length > 0 && (
            <span className="text-xs text-slate-400">tap to copy</span>
          )}
        </div>

        {variants.length === 0 && !loading && (
          <div className="text-slate-400 text-sm text-center py-20">
            Upload an image to get 3 variants.
          </div>
        )}

        {loading && (
          <div className="text-slate-400 text-sm text-center py-20 animate-pulse">
            Looking at the image…
          </div>
        )}

        <div className="space-y-3">
          {variants.map((v, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-ink-800 hover:bg-ink-700 cursor-pointer group"
              onClick={() => copy(v.text, i)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-brand-300">
                  {v.name}
                </span>
                <span className="text-xs text-slate-500">{v.label}</span>
              </div>
              <p className="text-sm leading-relaxed">{v.text}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <span>{v.chars} chars</span>
                <span className="text-brand-300">
                  {copiedIdx === i ? "Copied!" : "Copy"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
