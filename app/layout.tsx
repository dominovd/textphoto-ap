import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://textphoto.app"),
  title: {
    default: "textphoto.app — Free AI tools for photo + text",
    template: "%s · textphoto.app",
  },
  description:
    "Free AI tools for photo and text: caption generators, OCR, text effects, meme makers, alt-text. No sign up.",
  keywords: [
    "ai caption generator",
    "image to text",
    "photo to text",
    "ocr online",
    "text effects",
    "alt text generator",
    "meme generator",
  ],
  authors: [{ name: "textphoto.app" }],
  openGraph: {
    type: "website",
    siteName: "textphoto.app",
    title: "textphoto.app — Free AI tools for photo + text",
    description:
      "Captions, OCR, text effects, meme makers, alt-text — all free, all in one place.",
    url: "https://textphoto.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "textphoto.app — Free AI tools for photo + text",
    description: "Captions, OCR, text effects, meme makers, alt-text.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
