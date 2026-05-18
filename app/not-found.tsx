import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="text-sm uppercase text-brand-600 font-semibold mb-2">404</p>
      <h1 className="text-3xl font-bold mb-3">Tool not found</h1>
      <p className="text-slate-600 mb-8">
        The tool you&apos;re looking for doesn&apos;t exist (yet). It might be
        on our roadmap.
      </p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium"
      >
        Back to home
      </Link>
    </div>
  );
}
