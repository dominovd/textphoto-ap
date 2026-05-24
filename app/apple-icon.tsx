import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — mirrors the in-app Logo (polaroid + bold T inside a
 * rounded gradient square). Kept in sync with components/Logo.tsx so brand
 * mark is consistent across browser tab, iOS home-screen, and the website.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <svg
          viewBox="0 0 32 32"
          width={130}
          height={130}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="strip" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a855f7" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* Polaroid card */}
          <rect x="7" y="6" width="18" height="22" rx="2.2" fill="white" />
          {/* Bottom developing-photo strip */}
          <rect
            x="9.5"
            y="20"
            width="13"
            height="5.5"
            rx="0.8"
            fill="url(#strip)"
          />
          {/* Bold T inside the polaroid */}
          <path
            d="M11 9h10M16 9v9"
            stroke="#7c3aed"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
