"use client";

import { useState } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { UploadAffordance } from "@/lib/tool-icons";

const PROMPT_PRESETS: { label: string; emoji: string; prompt: string }[] = [
  {
    label: "Change background",
    emoji: "🌅",
    prompt:
      "Replace the background with a soft, blurred sunset on a tropical beach. Keep the main subject sharp and untouched.",
  },
  {
    label: "Studio white background",
    emoji: "⬜",
    prompt:
      "Replace the background with a clean pure white studio backdrop. Keep the subject perfectly preserved with realistic edge lighting.",
  },
  {
    label: "Color swap",
    emoji: "🎨",
    prompt:
      "Change the color of the main object to deep emerald green. Keep texture, lighting, and shadows realistic.",
  },
  {
    label: "Remove object",
    emoji: "🧹",
    prompt:
      "Remove the most distracting object in the background, filling the space naturally with surrounding scenery.",
  },
  {
    label: "Add sunglasses",
    emoji: "🕶️",
    prompt:
      "Add stylish black aviator sunglasses to the person, fit naturally on the face with realistic reflections.",
  },
  {
    label: "Make it sketch",
    emoji: "✏️",
    prompt:
      "Convert the entire image into a hand-drawn pencil sketch with cross-hatching and soft graphite shading on white paper.",
  },
];

type AspectRatio = "auto" | "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

const ASPECT_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "1:1", label: "1:1" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
];

// Demo pairs for the top-of-page "see how it works" section. Each pair is a
// known image we've already produced; before-URL and after-URL hosted on our
// Vercel Blob (or a stable CDN). When more demos are seeded, append here.
type DemoPair = {
  id: "background-change" | "color-change";
  label: string;
  beforeSrc: string;
  afterSrc: string;
};

// Seeded May 2026 via scripts/seed-editor-demo.mjs.
// 1024×576 webp in Blob under /editor-demo/.
const DEMO_BLOB = "https://0sbqqt82hdpagq0d.public.blob.vercel-storage.com/editor-demo";

const DEMO_PAIRS: DemoPair[] = [
  {
    id: "background-change",
    label: "Background change",
    beforeSrc: `${DEMO_BLOB}/bg-before.webp`,
    afterSrc: `${DEMO_BLOB}/bg-after.webp`,
  },
  {
    id: "color-change",
    label: "Color change",
    beforeSrc: `${DEMO_BLOB}/color-before.webp`,
    afterSrc: `${DEMO_BLOB}/color-after.webp`,
  },
];

export default function AiImageEditorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("auto");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [ms, setMs] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [demoTab, setDemoTab] = useState<DemoPair["id"]>("background-change");

  const activeDemo = DEMO_PAIRS.find((p) => p.id === demoTab) || DEMO_PAIRS[0];

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Photo too large — max 10 MB");
      return;
    }
    setError("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResultUrl("");
  }

  async function onGenerate() {
    if (!file) {
      setError("Upload an image first");
      return;
    }
    if (!prompt.trim()) {
      setError("Describe the edit you want");
      return;
    }
    setLoading(true);
    setError("");
    setResultUrl("");
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("prompt", prompt.trim());
      if (aspectRatio !== "auto") form.append("aspectRatio", aspectRatio);
      const res = await fetch("/api/ai-image-edit", {
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
      a.download = `textphoto-edit-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, "_blank");
    }
  }

  return (
    <div className="space-y-8">
      {/* Demo: tabbed before/after slider so visitors immediately see what the tool does */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">See how it works</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag the handle to compare before & after
            </p>
          </div>
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
            {DEMO_PAIRS.map((p) => (
              <button
                key={p.id}
                onClick={() => setDemoTab(p.id)}
                className={`px-4 py-1.5 rounded-full font-medium transition ${
                  demoTab === p.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <BeforeAfterSlider
          beforeSrc={activeDemo.beforeSrc}
          afterSrc={activeDemo.afterSrc}
          alt={activeDemo.label}
        />
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="text-sm font-semibold mb-2 block">
            1. Upload your image
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
                <UploadAffordance />
                <p className="text-sm text-slate-600">
                  Drop an image or{" "}
                  <span className="text-brand-600 font-medium">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  JPG/PNG/WEBP · max 10 MB
                </p>
              </>
            )}
          </label>

          <label className="text-sm font-semibold mt-5 mb-2 block">
            2. Describe the edit you want
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
            maxLength={500}
            rows={4}
            placeholder='e.g. "Change the background to a snowy mountain" or "Make the t-shirt red"'
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
          <p className="text-xs text-slate-400 mt-1">
            {prompt.length}/500 characters · be specific about what to change
          </p>

          <label className="text-xs font-semibold mt-4 mb-2 block text-slate-500">
            Quick ideas
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPrompt(p.prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-xs text-slate-600 border border-slate-200"
                title={p.prompt}
              >
                <span className="mr-1">{p.emoji}</span>
                {p.label}
              </button>
            ))}
          </div>

          <label className="text-sm font-semibold mt-5 mb-2 block">
            3. <span className="text-slate-500 font-medium">Optional:</span>{" "}
            aspect ratio
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ASPECT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAspectRatio(opt.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                  aspectRatio === opt.value
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Auto keeps the original photo&apos;s proportions
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={onGenerate}
            disabled={loading || !file || !prompt.trim()}
            className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
          >
            {loading ? "Editing…" : "Edit image →"}
          </button>
          <p className="text-xs text-slate-400 mt-2 text-center">
            AI image edit · usually 8-20 sec · limited to 1/hour, 3/day
          </p>
        </div>

        {/* Result */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Edited image</h3>
          </div>

          {!resultUrl && !loading && (
            <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm text-center px-6">
              Upload an image, describe the edit, hit go.
            </div>
          )}

          {loading && (
            <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 text-sm animate-pulse text-center px-6">
              Applying your edit…
            </div>
          )}

          {resultUrl && previewUrl && (
            <>
              <BeforeAfterSlider
                beforeSrc={previewUrl}
                afterSrc={resultUrl}
                alt="Your edit"
                className="min-h-[300px]"
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Generated by {provider} · {(ms / 1000).toFixed(1)}s
                </p>
                <button
                  onClick={onDownload}
                  className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium"
                >
                  Download PNG
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-400 text-center">
                Image link expires within a few hours — download to keep
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
