"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TEXT_EFFECT_STYLES, getStyle } from "@/lib/text-effect-styles";

// Outer wrapper — required so useSearchParams() (inside Inner) is wrapped
// in a Suspense boundary for static prerendering.
export default function AiTextEffectTool(props: { defaultStyleId?: string }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          Loading…
        </div>
      }
    >
      <AiTextEffectInner {...props} />
    </Suspense>
  );
}

function AiTextEffectInner({
  defaultStyleId,
}: {
  defaultStyleId?: string;
}) {
  const sp = useSearchParams();
  const urlStyle = sp.get("style") || defaultStyleId || TEXT_EFFECT_STYLES[0].id;
  const urlText = sp.get("text") || "";

  const initialStyle = getStyle(urlStyle) || TEXT_EFFECT_STYLES[0];
  const [styleId, setStyleId] = useState<string>(initialStyle.id);
  const [text, setText] = useState<string>(urlText || initialStyle.defaultText);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [ms, setMs] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const style = getStyle(styleId) || TEXT_EFFECT_STYLES[0];

  // Auto-update default text when style changes (only if user hasn't typed)
  useEffect(() => {
    const cur = getStyle(styleId);
    if (cur && text === "") setText(cur.defaultText);
    // intentionally not triggering on text change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleId]);

  async function onGenerate() {
    if (!text.trim()) {
      setError("Type something first");
      return;
    }
    setLoading(true);
    setError("");
    setResultUrl("");
    try {
      const res = await fetch("/api/ai-text-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, styleId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setResultUrl(data.url);
      setProvider(data.provider);
      setMs(data.ms);
      setShareUrl(""); // reset previous share
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Lazily upload to Vercel Blob and get a stable shareable URL.
   * Called the first time the user clicks any share button.
   */
  async function ensureShared(): Promise<string | null> {
    if (shareUrl) return shareUrl;
    if (!resultUrl) return null;
    setSharing(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: resultUrl, text, styleId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Share failed");
        return null;
      }
      setShareUrl(data.shareUrl);
      return data.shareUrl as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Share failed");
      return null;
    } finally {
      setSharing(false);
    }
  }

  async function onCopyLink() {
    const url = await ensureShared();
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function onShareTwitter() {
    const url = await ensureShared();
    if (!url) return;
    const tweet = `Made this with @textphoto.app — type a word, get a cinematic AI text effect: ${url}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function onShareReddit() {
    const url = await ensureShared();
    if (!url) return;
    const title = `"${text}" in ${style.name} — AI text effect (free, no signup)`;
    window.open(
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function onNativeShare() {
    const url = await ensureShared();
    if (!url) return;
    if (
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: `"${text}" in ${style.name} style`,
          text: "Made this with textphoto.app",
          url,
        });
      } catch {
        // user cancelled — ignore
      }
    } else {
      // Fallback: just copy link
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      a.download = `textphoto-${styleId}-${text.replace(/\s+/g, "_")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, "_blank");
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <label className="text-sm font-semibold mb-2 block">
          1. Your text
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 32))}
          maxLength={32}
          placeholder="Type a word…"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-base mb-1"
        />
        <p className="text-xs text-slate-400 mb-5">
          {text.length}/32 characters · short words work best
        </p>

        <label className="text-sm font-semibold mb-3 block">2. Style</label>
        <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
          {TEXT_EFFECT_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyleId(s.id)}
              className={`p-3 rounded-lg border text-left ${
                styleId === s.id
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className="text-xs font-semibold text-slate-900">
                {s.name}
              </div>
              <div className="text-xs text-slate-500 line-clamp-1">
                {s.description}
              </div>
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
          disabled={loading || !text.trim()}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
        >
          {loading ? "Generating…" : `Generate ${style.name} →`}
        </button>
        <p className="text-xs text-slate-400 mt-2 text-center">
          AI image generation · usually 5-15 sec · limited to 1/hour, 3/day
        </p>
      </div>

      {/* Result */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{style.name} result</h3>
        </div>

        {!resultUrl && !loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm text-center px-6">
            Type a word, pick a style, hit generate.
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm animate-pulse text-center px-6">
            Painting your &quot;{text}&quot; in {style.name.toLowerCase()}
            style…
          </div>
        )}

        {resultUrl && (
          <>
            <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt={`${text} in ${style.name} style`}
                className="max-h-[480px] max-w-full"
              />
            </div>

            {/* Share row */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 mr-1">Share:</span>
              <button
                onClick={onShareTwitter}
                disabled={sharing}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 text-sm text-slate-700 disabled:opacity-50"
                title="Share to Twitter / X"
              >
                𝕏 Twitter
              </button>
              <button
                onClick={onShareReddit}
                disabled={sharing}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 text-sm text-slate-700 disabled:opacity-50"
                title="Share to Reddit"
              >
                🤖 Reddit
              </button>
              <button
                onClick={onCopyLink}
                disabled={sharing}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 text-sm text-slate-700 disabled:opacity-50"
              >
                {copied ? "✓ Copied!" : sharing ? "Uploading…" : "🔗 Copy link"}
              </button>
              <button
                onClick={onNativeShare}
                disabled={sharing}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 text-sm text-slate-700 disabled:opacity-50 sm:hidden"
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
              Generated by {provider} · {(ms / 1000).toFixed(1)}s
              {shareUrl && (
                <>
                  {" · "}
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    view shareable page
                  </a>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
