import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-1 ml-6">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            href="/captions"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Captions
          </Link>
          <Link
            href="/ocr"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            OCR
          </Link>
          <Link
            href="/effects"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Text effects
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-500 w-64"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <span>Search tools…</span>
          </Link>
          <Link
            href="/captions/instagram-caption-generator"
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium"
          >
            Try free
          </Link>
        </div>
      </div>
    </header>
  );
}
