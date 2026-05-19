import type { CSSProperties } from "react";

export type EffectPreset = {
  name: string;
  swatch: string;
  style: CSSProperties;
};

export type EffectBackground = {
  name: string;
  className: string;
};

export type EffectConfig = {
  slug: string;
  defaultText: string;
  defaultSize: number;
  minSize: number;
  maxSize: number;
  defaultBg: number;
  fontFamily?: string;
  fontWeight: number;
  textTransform?: "uppercase" | "lowercase" | "none";
  letterSpacing?: string;
  presets: EffectPreset[];
  backgrounds: EffectBackground[];
};

const BG_DARK: EffectBackground = { name: "Dark", className: "bg-slate-900" };
const BG_BLACK: EffectBackground = { name: "Black", className: "bg-black" };
const BG_LIGHT: EffectBackground = { name: "Light", className: "bg-slate-100" };
const BG_CREAM: EffectBackground = {
  name: "Cream",
  className: "bg-gradient-to-br from-amber-50 to-orange-100",
};
const BG_BRICK: EffectBackground = {
  name: "Brick",
  className: "bg-gradient-to-br from-amber-950 to-stone-950",
};
const BG_PASTEL: EffectBackground = {
  name: "Pastel",
  className: "bg-gradient-to-br from-pink-100 to-purple-100",
};
const BG_TRANSPARENT: EffectBackground = {
  name: "Transparent",
  className:
    "bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9),linear-gradient(45deg,#f1f5f9_25%,#fff_25%,#fff_75%,#f1f5f9_75%,#f1f5f9)] bg-[size:24px_24px] bg-[position:0_0,12px_12px]",
};

export const effects: Record<string, EffectConfig> = {
  neon: {
    slug: "neon",
    defaultText: "NEON",
    defaultSize: 96,
    minSize: 40,
    maxSize: 160,
    defaultBg: 0,
    fontWeight: 800,
    letterSpacing: "0.04em",
    presets: [
      {
        name: "Cyan",
        swatch: "#22d3ee",
        style: {
          color: "#67e8f9",
          textShadow:
            "0 0 4px #67e8f9, 0 0 12px #22d3ee, 0 0 30px #22d3ee, 0 0 50px #0891b2",
        },
      },
      {
        name: "Pink",
        swatch: "#ec4899",
        style: {
          color: "#f9a8d4",
          textShadow:
            "0 0 4px #f9a8d4, 0 0 12px #ec4899, 0 0 30px #ec4899, 0 0 50px #be185d",
        },
      },
      {
        name: "Purple",
        swatch: "#a855f7",
        style: {
          color: "#d8b4fe",
          textShadow:
            "0 0 4px #d8b4fe, 0 0 12px #a855f7, 0 0 30px #a855f7, 0 0 50px #6b21a8",
        },
      },
      {
        name: "Lime",
        swatch: "#84cc16",
        style: {
          color: "#bef264",
          textShadow:
            "0 0 4px #bef264, 0 0 12px #84cc16, 0 0 30px #84cc16, 0 0 50px #3f6212",
        },
      },
      {
        name: "Orange",
        swatch: "#f97316",
        style: {
          color: "#fdba74",
          textShadow:
            "0 0 4px #fdba74, 0 0 12px #f97316, 0 0 30px #f97316, 0 0 50px #9a3412",
        },
      },
      {
        name: "White",
        swatch: "#e5e7eb",
        style: {
          color: "#ffffff",
          textShadow:
            "0 0 4px #ffffff, 0 0 12px #e5e7eb, 0 0 30px #e5e7eb, 0 0 50px #94a3b8",
        },
      },
    ],
    backgrounds: [BG_DARK, BG_BLACK, BG_BRICK, BG_TRANSPARENT],
  },

  fire: {
    slug: "fire",
    defaultText: "FIRE",
    defaultSize: 110,
    minSize: 48,
    maxSize: 180,
    defaultBg: 0,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    presets: [
      {
        name: "Classic",
        swatch: "#f97316",
        style: {
          background:
            "linear-gradient(180deg, #fde68a 0%, #f59e0b 30%, #ea580c 60%, #991b1b 90%, #1c1917 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow:
            "0 0 6px rgba(249,115,22,.5), 0 4px 12px rgba(220,38,38,.5)",
        } as CSSProperties,
      },
      {
        name: "Inferno",
        swatch: "#dc2626",
        style: {
          background:
            "linear-gradient(180deg, #fef9c3 0%, #fb923c 25%, #dc2626 70%, #450a0a 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow:
            "0 0 10px rgba(220,38,38,.8), 0 6px 18px rgba(127,29,29,.6)",
        } as CSSProperties,
      },
      {
        name: "Blue flame",
        swatch: "#3b82f6",
        style: {
          background:
            "linear-gradient(180deg, #e0f2fe 0%, #38bdf8 25%, #2563eb 60%, #1e1b4b 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow:
            "0 0 8px rgba(56,189,248,.7), 0 4px 14px rgba(30,64,175,.5)",
        } as CSSProperties,
      },
      {
        name: "Toxic",
        swatch: "#22c55e",
        style: {
          background:
            "linear-gradient(180deg, #ecfccb 0%, #84cc16 30%, #166534 70%, #052e16 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow:
            "0 0 8px rgba(132,204,22,.7), 0 4px 14px rgba(22,101,52,.5)",
        } as CSSProperties,
      },
    ],
    backgrounds: [BG_DARK, BG_BLACK, BG_TRANSPARENT],
  },

  bubble: {
    slug: "bubble",
    defaultText: "POP",
    defaultSize: 120,
    minSize: 56,
    maxSize: 200,
    defaultBg: 0,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    presets: [
      {
        name: "Classic",
        swatch: "#1e293b",
        style: {
          color: "#ffffff",
          WebkitTextStroke: "3px #1e293b",
          textShadow: "6px 6px 0 #1e293b",
        } as CSSProperties,
      },
      {
        name: "Pink",
        swatch: "#ec4899",
        style: {
          color: "#ffffff",
          WebkitTextStroke: "3px #be185d",
          textShadow: "6px 6px 0 #be185d, 8px 8px 0 #831843",
        } as CSSProperties,
      },
      {
        name: "Blue",
        swatch: "#2563eb",
        style: {
          color: "#ffffff",
          WebkitTextStroke: "3px #1e3a8a",
          textShadow: "6px 6px 0 #1e3a8a",
        } as CSSProperties,
      },
      {
        name: "Gold",
        swatch: "#eab308",
        style: {
          color: "#fef9c3",
          WebkitTextStroke: "3px #78350f",
          textShadow: "6px 6px 0 #78350f, 8px 8px 0 #422006",
        } as CSSProperties,
      },
      {
        name: "Mint",
        swatch: "#14b8a6",
        style: {
          color: "#f0fdfa",
          WebkitTextStroke: "3px #0f766e",
          textShadow: "6px 6px 0 #0f766e",
        } as CSSProperties,
      },
    ],
    backgrounds: [BG_LIGHT, BG_PASTEL, BG_CREAM, BG_TRANSPARENT],
  },

  cursive: {
    slug: "cursive",
    defaultText: "Beautiful",
    defaultSize: 110,
    minSize: 48,
    maxSize: 180,
    defaultBg: 0,
    fontFamily: '"Brush Script MT", "Lucida Handwriting", "Snell Roundhand", cursive',
    fontWeight: 400,
    presets: [
      {
        name: "Black",
        swatch: "#0f172a",
        style: { color: "#0f172a", fontStyle: "italic" } as CSSProperties,
      },
      {
        name: "Rose",
        swatch: "#e11d48",
        style: { color: "#e11d48", fontStyle: "italic" } as CSSProperties,
      },
      {
        name: "Royal",
        swatch: "#7c3aed",
        style: {
          color: "#7c3aed",
          fontStyle: "italic",
          textShadow: "2px 2px 0 rgba(124,58,237,.15)",
        } as CSSProperties,
      },
      {
        name: "Forest",
        swatch: "#15803d",
        style: { color: "#15803d", fontStyle: "italic" } as CSSProperties,
      },
      {
        name: "Gold ink",
        swatch: "#ca8a04",
        style: {
          background:
            "linear-gradient(180deg,#fbbf24 0%,#ca8a04 60%,#78350f 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          fontStyle: "italic",
        } as CSSProperties,
      },
    ],
    backgrounds: [BG_CREAM, BG_LIGHT, BG_PASTEL, BG_TRANSPARENT],
  },

  glitch: {
    slug: "glitch",
    defaultText: "GLITCH",
    defaultSize: 110,
    minSize: 48,
    maxSize: 180,
    defaultBg: 0,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    presets: [
      {
        name: "Classic",
        swatch: "#ef4444",
        style: {
          color: "#f8fafc",
          textShadow: "3px 0 #ef4444, -3px 0 #06b6d4",
        } as CSSProperties,
      },
      {
        name: "Strong",
        swatch: "#dc2626",
        style: {
          color: "#ffffff",
          textShadow:
            "5px 0 #dc2626, -5px 0 #06b6d4, 0 0 12px rgba(255,255,255,.15)",
        } as CSSProperties,
      },
      {
        name: "Subtle",
        swatch: "#a855f7",
        style: {
          color: "#f8fafc",
          textShadow: "2px 0 #a855f7, -2px 0 #f59e0b",
        } as CSSProperties,
      },
      {
        name: "Vapor",
        swatch: "#ec4899",
        style: {
          color: "#f0abfc",
          textShadow:
            "4px 0 #ec4899, -4px 0 #22d3ee, 0 0 18px rgba(236,72,153,.3)",
        } as CSSProperties,
      },
    ],
    backgrounds: [BG_BLACK, BG_DARK, BG_BRICK],
  },

  gold: {
    slug: "gold",
    defaultText: "GOLD",
    defaultSize: 110,
    minSize: 48,
    maxSize: 180,
    defaultBg: 0,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    presets: [
      {
        name: "Classic",
        swatch: "#eab308",
        style: {
          background:
            "linear-gradient(180deg,#fff7d6 0%,#fde047 25%,#ca8a04 70%,#78350f 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: "0 4px 12px rgba(202,138,4,.4)",
        } as CSSProperties,
      },
      {
        name: "Rose gold",
        swatch: "#f59e0b",
        style: {
          background:
            "linear-gradient(180deg,#fff1f2 0%,#fda4af 25%,#be123c 70%,#4c0519 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: "0 4px 12px rgba(190,18,60,.4)",
        } as CSSProperties,
      },
      {
        name: "White gold",
        swatch: "#e2e8f0",
        style: {
          background:
            "linear-gradient(180deg,#ffffff 0%,#cbd5e1 30%,#94a3b8 70%,#475569 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: "0 4px 12px rgba(100,116,139,.4)",
        } as CSSProperties,
      },
      {
        name: "Bronze",
        swatch: "#b45309",
        style: {
          background:
            "linear-gradient(180deg,#fde68a 0%,#b45309 50%,#451a03 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: "0 4px 12px rgba(180,83,9,.4)",
        } as CSSProperties,
      },
    ],
    backgrounds: [BG_BLACK, BG_DARK, BG_BRICK],
  },
};

export function getEffect(slug: string): EffectConfig | undefined {
  return effects[slug];
}
