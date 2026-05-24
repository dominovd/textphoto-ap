"use client";

import { useState } from "react";
import { VibeIcon } from "@/lib/tool-icons";

const VIBES = [
  { id: "aesthetic", label: "Aesthetic" },
  { id: "funny", label: "Funny" },
  { id: "professional", label: "Professional" },
  { id: "inspirational", label: "Inspirational" },
  { id: "edgy", label: "Edgy" },
  { id: "cute", label: "Cute" },
];

type Bio = { text: string; chars: number; overLimit: boolean };

export default function InstagramBioTool() {
  const [niche, setNiche] = useState("");
  const [vibe, setVibe] = useState("aesthetic");
  const [emojis, setEmojis] = useState(true);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [bios, setBios] = useState<Bio[]>([]);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function onGenerate() {
    if (!niche.trim()) {
      setError("Tell us your niche or focus first");
      return;
    }
    setLoading(true);
    setError("");
    setBios([]);
    try {
      const res = await fetch("/api/instagram-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, vibe, emojis, keywords }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setBios(data.bios || []);
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
        <label className="text-sm font-semibold mb-2 block">
          1. Your niche or focus
        </label>
        <input
          value={niche}
          onChange={(e) => setNiche(e.target.value.slice(0, 200))}
          placeholder="e.g. fitness coach, food blogger, indie game dev"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-base mb-1"
        />
        <p className="text-xs text-slate-400 mb-4">
          {niche.length}/200 — be specific, e.g. &quot;plant-based recipes
          for busy moms&quot; not just &quot;food&quot;
        </p>

        <label className="text-sm font-semibold mb-3 block">2. Vibe</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VIBES.map((v) => (
            <button
              key={v.id}
              onClick={() => setVibe(v.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${
                vibe === v.id
                  ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <VibeIcon id={v.id} />
              <span>{v.label}</span>
            </button>
          ))}
        </div>

        <label className="text-sm font-semibold mt-6 mb-2 block">
          3. Keywords to include (optional)
        </label>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value.slice(0, 200))}
          placeholder="e.g. NYC, vegan, coach, podcast host"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
        />

        <div className="flex items-center justify-between mt-6 text-sm">
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

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={onGenerate}
          disabled={loading || !niche.trim()}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
        >
          {loading ? "Writing bios…" : "Generate 10 bios →"}
        </button>
      </div>

      {/* Output */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Bio ideas</h3>
          {bios.length > 0 && (
            <span className="text-xs text-slate-400">tap to copy</span>
          )}
        </div>

        {bios.length === 0 && !loading && (
          <div className="text-slate-400 text-sm text-center py-20">
            Tell us your niche to get 10 bio ideas.
          </div>
        )}

        {loading && (
          <div className="text-slate-400 text-sm text-center py-20 animate-pulse">
            Brewing bios in {vibe} style…
          </div>
        )}

        <div className="space-y-3">
          {bios.map((b, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-ink-800 hover:bg-ink-700 cursor-pointer group"
              onClick={() => copy(b.text, i)}
            >
              <p className="text-sm leading-relaxed">{b.text}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <span
                  className={
                    b.overLimit ? "text-red-400" : "text-slate-400"
                  }
                >
                  {b.chars}/150 chars{b.overLimit ? " · too long" : ""}
                </span>
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
