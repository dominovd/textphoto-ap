import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="mb-3">
            <Logo size="sm" />
          </div>
          <p className="text-slate-500 text-xs">
            Free AI tools for photo + text. No sign up.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3 text-xs uppercase text-slate-400">
            Categories
          </div>
          <ul className="space-y-1.5 text-slate-600">
            <li>
              <Link href="/captions" className="hover:text-brand-600">
                Captions
              </Link>
            </li>
            <li>
              <Link href="/ocr" className="hover:text-brand-600">
                OCR / Photo to Text
              </Link>
            </li>
            <li>
              <Link href="/effects" className="hover:text-brand-600">
                Text effects
              </Link>
            </li>
            <li>
              <Link href="/memes" className="hover:text-brand-600">
                Meme makers
              </Link>
            </li>
            <li>
              <Link href="/enhance" className="hover:text-brand-600">
                Photo enhancement
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-xs uppercase text-slate-400">
            Resources
          </div>
          <ul className="space-y-1.5 text-slate-600">
            <li>Blog (coming soon)</li>
            <li>API (coming soon)</li>
            <li>
              <a
                href="mailto:info@textphoto.app?subject=Tool%20idea"
                className="hover:text-brand-600"
              >
                Submit a tool idea
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-xs uppercase text-slate-400">
            Company
          </div>
          <ul className="space-y-1.5 text-slate-600">
            <li>
              <Link href="/about" className="hover:text-brand-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-600">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-600">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-600">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} textphoto.app · Free forever
      </div>
    </footer>
  );
}
