"use client";

import { useState } from "react";

const VIBES = [
  { id: "aesthetic", label: "✨ Aesthetic" },
  { id: "funny", label: "😂 Funny" },
  { id: "romantic", label: "💕 Romantic" },
  { id: "savage", label: "🔥 Savage" },
  { id: "professional", label: "💼 Professional" },
  { id: "inspirational", label: "🎓 Inspirational" },
];

type Caption = { text: string; chars: number; hashtags: number };

export default function InstagramCaptionTool() {
  const [vibe, setVibe] = useState("aesthetic");
  const [hashtags, setHashtags] = useState(true);
  const [emojis, setEmojis] = useState(true);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [filename, setFilename] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFilename(f.name);
  }

  async function onGenerate() {
    setLoading(true);
    setCaptions([]);
    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe, hashtags, emojis }),
      });
      const data = await res.json();
      setCaptions(data.captions || []);
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <label className="text-sm font-semibold mb-3 block">
          1. Upload your photo
        </label>
        <label className="block border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-brand-400 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          <div className="text-4xl mb-2">📷</div>
          {filename ? (
            <p className="text-sm text-slate-700 font-medium">{filename}</p>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                Drop a photo here or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, WEBP · up to 10 MB
              </p>
            </>
          )}
        </label>

        <label className="text-sm font-semibold mt-6 mb-3 block">
          2. Pick a vibe
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VIBES.map((v) => (
            <button
              key={v.id}
              onClick={() => setVibe(v.id)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                vibe === v.id
                  ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <label className="text-sm font-semibold mt-6 mb-3 block">
          3. Options
        </label>
        <div className="flex items-center justify-between mb-3 text-sm">
          <span>Include hashtags</span>
          <button
            onClick={() => setHashtags(!hashtags)}
            className={`w-10 h-6 rounded-full relative transition ${
              hashtags ? "bg-brand-600" : "bg-slate-300"
            }`}
            aria-label="Toggle hashtags"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
                hashtags ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Include emojis</span>
          <button
            onClick={() => setEmojis(!emojis)}
            className={`w-10 h-6 rounded-full relative transition ${
              emojis ? "bg-brand-600" : "bg-slate-300"
            }`}
            aria-label="Toggle emojis"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
                emojis ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-semibold"
        >
          {loading ? "Generating…" : "Generate 10 captions →"}
        </button>
      </div>

      {/* Output */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Your captions</h3>
          {captions.length > 0 && (
            <span className="text-xs text-slate-400">
              {captions.length} generated
            </span>
          )}
        </div>

        {captions.length === 0 && !loading && (
          <div className="text-slate-400 text-sm text-center py-20">
            Upload a photo and pick a vibe to get started.
          </div>
        )}

        {loading && (
          <div className="text-slate-400 text-sm text-center py-20 animate-pulse">
            Cooking up 10 captions…
          </div>
        )}

        <div className="space-y-3">
          {captions.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-ink-800 hover:bg-ink-700 cursor-pointer group"
              onClick={() => copy(c.text, i)}
            >
              <p className="text-sm leading-relaxed">{c.text}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <span>
                  {c.chars} chars · {c.hashtags} hashtag
                  {c.hashtags === 1 ? "" : "s"}
                </span>
                <span className="text-brand-300">
                  {copiedIndex === i ? "Copied!" : "Copy"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
