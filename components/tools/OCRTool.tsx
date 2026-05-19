"use client";

import { useState } from "react";

type Mode = "default" | "handwriting" | "translate";

const MODE_CONFIG: Record<
  Mode,
  {
    endpoint: string;
    icon: string;
    placeholder: string;
    buttonLabel: string;
    loadingLabel: string;
    extractedLabel: string;
    extraField?: "language";
  }
> = {
  default: {
    endpoint: "/api/ocr",
    icon: "🔠",
    placeholder: "Receipts, screenshots, scanned docs",
    buttonLabel: "Extract text →",
    loadingLabel: "Reading characters…",
    extractedLabel: "Extracted text",
  },
  handwriting: {
    endpoint: "/api/handwriting",
    icon: "✍️",
    placeholder: "Handwritten notes, letters, signed forms",
    buttonLabel: "Extract handwriting →",
    loadingLabel: "Reading the handwriting…",
    extractedLabel: "Extracted text",
  },
  translate: {
    endpoint: "/api/translate-from-photo",
    icon: "🌐",
    placeholder: "Menus, signs, documents in foreign language",
    buttonLabel: "Extract + translate →",
    loadingLabel: "Translating the photo…",
    extractedLabel: "Translation",
    extraField: "language",
  },
};

const TARGET_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Ukrainian",
  "Polish",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
];

export default function OCRTool({ mode = "default" }: { mode?: Mode }) {
  const config = MODE_CONFIG[mode];
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [original, setOriginal] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("");
  const [empty, setEmpty] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [language, setLanguage] = useState("auto-detect");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Image too large — max 10 MB");
      return;
    }
    setError("");
    setEmpty(false);
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setText("");
    setOriginal("");
  }

  async function onExtract() {
    if (!file) return;
    setLoading(true);
    setError("");
    setEmpty(false);
    setText("");
    setOriginal("");
    try {
      const form = new FormData();
      form.append("image", file);
      if (mode === "translate") {
        form.append("targetLanguage", targetLanguage);
      } else if (mode === "default") {
        form.append("language", language);
      }
      const res = await fetch(config.endpoint, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      if (data.empty) {
        setEmpty(true);
        return;
      }
      if (mode === "translate") {
        setOriginal(data.original || "");
        setText(data.translated || "");
        setSourceLanguage(data.sourceLanguage || "");
      } else {
        setText(data.text || "");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function copy(value: string) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <label className="text-sm font-semibold mb-3 block">
          1. Upload an image
        </label>
        <label className="block border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-brand-400 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={file?.name || "preview"}
              className="max-h-44 mx-auto rounded-lg"
            />
          ) : (
            <>
              <div className="text-4xl mb-2">{config.icon}</div>
              <p className="text-sm text-slate-600">
                Drop an image or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">{config.placeholder}</p>
            </>
          )}
        </label>

        {mode === "default" && (
          <>
            <label className="text-sm font-semibold mt-6 mb-3 block">
              2. Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
            >
              <option value="auto-detect">Auto-detect</option>
              {TARGET_LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </>
        )}

        {mode === "translate" && (
          <>
            <label className="text-sm font-semibold mt-6 mb-3 block">
              2. Translate to
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
            >
              {TARGET_LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={onExtract}
          disabled={loading || !file}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white font-semibold"
        >
          {loading ? "Working…" : config.buttonLabel}
        </button>
      </div>

      {/* Output */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{config.extractedLabel}</h3>
          {text && (
            <button
              onClick={() => copy(text)}
              className="text-xs px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        {!text && !loading && !empty && (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm text-center">
            Upload an image to get started.
          </div>
        )}
        {loading && (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm animate-pulse">
            {config.loadingLabel}
          </div>
        )}
        {empty && (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm text-center">
            No text detected in this image.
          </div>
        )}
        {text && (
          <div className="flex-1 space-y-3 overflow-auto">
            {mode === "translate" && original && (
              <div>
                <div className="text-xs text-slate-400 mb-1">
                  Original ({sourceLanguage || "detected"})
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-ink-800 rounded-lg p-3">
                  {original}
                </pre>
              </div>
            )}
            <div>
              {mode === "translate" && (
                <div className="text-xs text-brand-300 mb-1">
                  → {targetLanguage}
                </div>
              )}
              <pre className="whitespace-pre-wrap text-sm bg-ink-800 rounded-lg p-4">
                {text}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
