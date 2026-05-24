"use client";

import { useState } from "react";
import { VibeIcon, UploadAffordance } from "@/lib/tool-icons";

const STYLES = [
  { id: "mixed", label: "Mixed" },
  { id: "relatable", label: "Relatable" },
  { id: "savage", label: "Savage" },
  { id: "wholesome", label: "Wholesome" },
  { id: "gen_z", label: "Gen Z" },
];

type Meme = { text: string; chars: number };

export default function MemeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [style, setStyle] = useState("mixed");
  const [memes, setMemes] = useState<Meme[]>([]);
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
    setMemes([]);
  }

  async function onGenerate() {
    if (!file) return;
    setLoading(true);
    setError("");
    setMemes([]);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("style", style);
      const res = await fetch("/api/meme", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setMemes(data.memes || []);
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
              className="max-h-44 mx-auto rounded-lg"
            />
          ) : (
            <>
              <UploadAffordance />
              <p className="text-sm text-slate-600">
                Drop a photo or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Your face, your pet, a screenshot, anything
              </p>
            </>
          )}
        </label>

        <label className="text-sm font-semibold mt-6 mb-3 block">
          2. Pick a style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${
                style === s.id
                  ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <VibeIcon id={s.id} />
              <span>{s.label}</span>
            </button>
          ))}
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
          {loading ? "Cooking memes…" : "Generate 5 meme captions →"}
        </button>
      </div>

      {/* Output */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Your memes</h3>
          {memes.length > 0 && (
            <span className="text-xs text-slate-400">tap to copy</span>
          )}
        </div>

        {memes.length === 0 && !loading && (
          <div className="text-slate-400 text-sm text-center py-20">
            Upload a photo, pick a style, get 5 captions.
          </div>
        )}

        {loading && (
          <div className="text-slate-400 text-sm text-center py-20 animate-pulse">
            Brewing chaos…
          </div>
        )}

        <div className="space-y-3">
          {memes.map((m, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-ink-800 hover:bg-ink-700 cursor-pointer group"
              onClick={() => copy(m.text, i)}
            >
              <p className="text-sm leading-relaxed">{m.text}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <span>{m.chars} chars</span>
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
