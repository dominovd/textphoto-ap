import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              T
            </span>
            <span className="font-bold">
              textphoto<span className="text-brand-600">.app</span>
            </span>
          </div>
          <p className="text-slate-500 text-xs">
            Free AI tools for photo + text. No sign up.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-xs uppercase text-slate-400">
            Categories
          </h4>
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
          <h4 className="font-semibold mb-3 text-xs uppercase text-slate-400">
            Resources
          </h4>
          <ul className="space-y-1.5 text-slate-600">
            <li>Blog</li>
            <li>API (coming soon)</li>
            <li>Browser extension</li>
            <li>Submit a tool idea</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-xs uppercase text-slate-400">
            Company
          </h4>
          <ul className="space-y-1.5 text-slate-600">
            <li>About</li>
            <li>Contact</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} textphoto.app · Free forever
      </div>
    </footer>
  );
}
