import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "TextPhoto builds free AI tools for photo and text — captions, OCR, text effects, alt-text, meme makers. No sign up, no paywall.",
  alternates: { canonical: "https://textphoto.app/about" },
};

export default function About() {
  return (
    <PageShell
      title="About TextPhoto"
      description="Free AI tools for photo and text. Built for creators, marketers, and anyone who works with images."
    >
      <h2>What we do</h2>
      <p>
        TextPhoto is a collection of free, no-signup AI tools focused on
        everything at the intersection of photos and text — caption generators,
        OCR, text effects on images, alt-text, meme makers, and more. Every
        tool is browser-based, instant, and free forever.
      </p>

      <h2>Why we built it</h2>
      <p>
        AI image and text tools used to live behind paywalls, signups, or
        ten-step onboarding flows. We think the basics should be free — drop a
        photo, get a result, copy it, leave. That&apos;s the whole product.
      </p>

      <h2>How we make money</h2>
      <p>
        Right now: nothing. Long-term we plan to launch an API for developers
        and a small set of premium add-ons (bulk processing, custom branding).
        The free tools stay free.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, feedback, partnership ideas, tool requests — email us at{" "}
        <a href="mailto:info@textphoto.app">info@textphoto.app</a>.
      </p>
    </PageShell>
  );
}
