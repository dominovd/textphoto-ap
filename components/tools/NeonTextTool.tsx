"use client";

import { useState } from "react";

const PRESETS = [
  { name: "Cyan", glow: "#22d3ee", core: "#67e8f9", deep: "#0891b2" },
  { name: "Pink", glow: "#ec4899", core: "#f9a8d4", deep: "#be185d" },
  { name: "Purple", glow: "#a855f7", core: "#d8b4fe", deep: "#6b21a8" },
  { name: "Lime", glow: "#84cc16", core: "#bef264", deep: "#3f6212" },
  { name: "Orange", glow: "#f97316", core: "#fdba74", deep: "#9a3412" },
  { name: "White", glow: "#e5e7eb", core: "#ffffff", deep: "#94a3b8" },
];

const BACKGROUNDS = [
  { id: "dark", label: "Dark", className: "bg-slate-900" },
  { id: "black", label: "Black", className: "bg-black" },
  { id: "brick", label: "Brick", className: "bg-gradient-to-br from-amber-950 to-stone-950" },
  { id: "transparent", label: "Transparent", className: "bg-[conic-gradient(at_top_left,_#0001_25%,_#fff_25%,_#fff_50%,_#0001_50%,_#0001_75%,_#fff_75%)] bg-[length:24px_24px]" },
];

export default function NeonTextTool() {
  const [text, setText] = useState("NEON");
  const [preset, setPreset] = useState(0);
  const [bg, setBg] = useState(0);
  const [size, setSize] = useState(80);

  const p = PRESETS[preset];
  const b = BACKGROUNDS[bg];

  const neonStyle: React.CSSProperties = {
    color: p.core,
    fontSize: `${size}px`,
    lineHeight: 1.1,
    textShadow: `0 0 4px ${p.core}, 0 0 12px ${p.glow}, 0 0 30px ${p.glow}, 0 0 50px ${p.deep}`,
    fontWeight: 800,
    letterSpacing: "0.03em",
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <label className="text-sm font-semibold mb-2 block">Your text</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 24))}
          maxLength={24}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-base mb-1"
          placeholder="Type something…"
        />
        <p className="text-xs text-slate-400 mb-5">
          {text.length}/24 characters
        </p>

        <label className="text-sm font-semibold mb-2 block">Color</label>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {PRESETS.map((pr, i) => (
            <button
              key={pr.name}
              onClick={() => setPreset(i)}
              className={`p-2 rounded-lg border text-xs font-medium ${
                preset === i ? "border-brand-500" : "border-slate-200"
              }`}
            >
              <span
                className="inline-block w-4 h-4 rounded-full mr-1 align-middle"
                style={{ backgroundColor: pr.glow }}
              />
              {pr.name}
            </button>
          ))}
        </div>

        <label className="text-sm font-semibold mb-2 block">Background</label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {BACKGROUNDS.map((bgo, i) => (
            <button
              key={bgo.id}
              onClick={() => setBg(i)}
              className={`p-2 rounded-lg border text-xs font-medium ${
                bg === i ? "border-brand-500" : "border-slate-200"
              }`}
            >
              {bgo.label}
            </button>
          ))}
        </div>

        <label className="text-sm font-semibold mb-2 block">
          Size ({size}px)
        </label>
        <input
          type="range"
          min={40}
          max={160}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full"
        />

        <button
          onClick={() => window.print()}
          className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold"
        >
          Download as PNG
        </button>
        <p className="text-xs text-slate-400 mt-2 text-center">
          (Right-click preview → Save Image — full export coming soon)
        </p>
      </div>

      {/* Preview */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 overflow-hidden">
        <div
          className={`${b.className} min-h-[480px] flex items-center justify-center p-8`}
        >
          <span style={neonStyle} className="text-center break-words">
            {text || "TYPE SOMETHING"}
          </span>
        </div>
      </div>
    </div>
  );
}
