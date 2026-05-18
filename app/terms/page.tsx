import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms you agree to when using TextPhoto.",
  alternates: { canonical: "https://textphoto.app/terms" },
};

export default function Terms() {
  return (
    <PageShell title="Terms of Service" description="Last updated: May 2026">
      <p>
        By using textphoto.app (&quot;the service&quot;, &quot;we&quot;,
        &quot;us&quot;) you agree to the following terms. If you don&apos;t
        agree, please don&apos;t use the service.
      </p>

      <h2>1. What you can do</h2>
      <ul>
        <li>Use the free tools for personal or commercial work.</li>
        <li>
          Use the outputs (captions, extracted text, generated images) however
          you like, including in client or commercial projects.
        </li>
        <li>Link to us, share us, recommend us.</li>
      </ul>

      <h2>2. What you can&apos;t do</h2>
      <ul>
        <li>
          Upload content that violates other people&apos;s rights — copyright,
          privacy, likeness — or that is illegal, harassing, or abusive.
        </li>
        <li>
          Scrape, automate, or hammer the service in ways that degrade it for
          other users. If you need bulk processing, email us about API access.
        </li>
        <li>
          Try to extract our prompts, reverse-engineer the AI providers, or
          impersonate our brand.
        </li>
      </ul>

      <h2>3. AI output</h2>
      <p>
        AI-generated content can be wrong, biased, or strange. Review outputs
        before using them anywhere that matters. You are responsible for what
        you publish.
      </p>

      <h2>4. Availability</h2>
      <p>
        The free service is provided as-is, with no uptime guarantee. We may
        rate-limit, change, or shut down individual tools without notice.
      </p>

      <h2>5. Liability</h2>
      <p>
        We are not liable for any damages resulting from using the service to
        the maximum extent permitted by law.
      </p>

      <h2>6. Changes</h2>
      <p>
        We may update these terms. The &quot;Last updated&quot; date at the
        top of this page reflects the most recent change.
      </p>

      <h2>7. Contact</h2>
      <p>
        Email <a href="mailto:info@textphoto.app">info@textphoto.app</a>.
      </p>
    </PageShell>
  );
}
