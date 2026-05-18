"use client";

import { useState } from "react";

export default function OCRTool() {
  const [filename, setFilename] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFilename(f.name);
    setImageUrl(URL.createObjectURL(f));
    setText("");
  }

  async function onExtract() {
    setLoading(true);
    setText("");
    try {
      const res = await fetch("/api/ocr", { method: "POST" });
      const data = await res.json();
      setText(data.text || "");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!text) return;
    navigator.clipboard.writeText(text);
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
        <label className="block border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-brand-400 cursor-pointer">
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
              alt={filename}
              className="max-h-48 mx-auto rounded-lg"
            />
          ) : (
            <>
              <div className="text-4xl mb-2">🔠</div>
              <p className="text-sm text-slate-600">
                Drop an image here or{" "}
                <span className="text-brand-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Receipts, screenshots, handwriting, scanned docs
              </p>
            </>
          )}
        </label>

        <label className="text-sm font-semibold mt-6 mb-3 block">
          2. Language
        </label>
        <select className="w-full text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <option>Auto-detect</option>
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
          <option>Russian</option>
          <option>Chinese</option>
          <option>Japanese</option>
        </select>

        <button
          onClick={onExtract}
          disabled={loading || !filename}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-semibold"
        >
          {loading ? "Extracting…" : "Extract text →"}
        </button>
      </div>

      {/* Output */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Extracted text</h3>
          {text && (
            <button
              onClick={copy}
              className="text-xs px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700"
            >
              {copied ? "Copied!" : "Copy all"}
            </button>
          )}
        </div>

        {!text && !loading && (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm text-center">
            Upload an image and hit Extract.
          </div>
        )}
        {loading && (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm animate-pulse">
            Reading characters…
          </div>
        )}
        {text && (
          <pre className="flex-1 whitespace-pre-wrap text-sm bg-ink-800 rounded-lg p-4 overflow-auto">
            {text}
          </pre>
        )}
      </div>
    </div>
  );
}
