import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How TextPhoto handles your data. We don't sell it, we don't train on it, and we delete uploads after processing.",
  alternates: { canonical: "https://textphoto.app/privacy" },
};

export default function Privacy() {
  return (
    <PageShell
      title="Privacy Policy"
      description="Last updated: May 2026"
    >
      <p>
        This policy explains what information TextPhoto (&quot;we&quot;)
        collects when you use textphoto.app, how we use it, and how you can
        contact us about it.
      </p>

      <h2>1. What we collect</h2>
      <h3>Photos and text you upload</h3>
      <p>
        When you use a tool that requires an upload (e.g. OCR, caption
        generator), your file is sent to our processing server and may be
        forwarded to a third-party AI provider for processing.
      </p>
      <ul>
        <li>We do not store uploads beyond what is required for the request.</li>
        <li>Uploads are deleted from our servers within 24 hours.</li>
        <li>Uploads are never used to train AI models.</li>
      </ul>

      <h3>Usage analytics</h3>
      <p>
        We collect anonymous, aggregated usage data — page views, tool counts,
        rough country — using a privacy-respecting analytics provider. We do
        not use cookies that track you across other websites.
      </p>

      <h3>Email (when you contact us)</h3>
      <p>
        If you email us at{" "}
        <a href="mailto:info@textphoto.app">info@textphoto.app</a>, we keep
        the email thread for support purposes only.
      </p>

      <h2>2. What we don&apos;t do</h2>
      <ul>
        <li>We don&apos;t sell your data to anyone.</li>
        <li>We don&apos;t track you across other websites.</li>
        <li>We don&apos;t require you to sign up to use the free tools.</li>
      </ul>

      <h2>3. Third parties</h2>
      <p>
        We use the following services to run the site. Each has their own
        privacy policy:
      </p>
      <ul>
        <li>
          <strong>Vercel</strong> — hosting and CDN.
        </li>
        <li>
          <strong>An AI provider</strong> (such as Anthropic or OpenAI) — for
          tools that require an AI model.
        </li>
      </ul>

      <h2>4. Your rights</h2>
      <p>
        You can request deletion of any data we hold about you by emailing{" "}
        <a href="mailto:info@textphoto.app">info@textphoto.app</a>.
      </p>

      <h2>5. Changes to this policy</h2>
      <p>
        If we change anything material, we&apos;ll update the &quot;Last
        updated&quot; date at the top of this page.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:info@textphoto.app">info@textphoto.app</a>.
      </p>
    </PageShell>
  );
}
