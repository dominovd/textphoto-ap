import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with TextPhoto — feedback, tool requests, partnerships, press. Email info@textphoto.app.",
  alternates: { canonical: "https://textphoto.app/contact" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: "https://textphoto.app/contact",
  mainEntity: {
    "@type": "Organization",
    name: "TextPhoto",
    email: "info@textphoto.app",
    url: "https://textphoto.app",
  },
};

export default function Contact() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageShell
        title="Contact"
        description="The fastest way to reach us is email."
      >
        <h2>General inquiries</h2>
        <p>
          <a href="mailto:info@textphoto.app">info@textphoto.app</a>
        </p>
        <p>
          We try to reply within 1–2 business days. For tool requests, please
          include a brief description and a link to a similar tool if it exists
          — it helps us prioritise.
        </p>

        <h2>What to email us about</h2>
        <ul>
          <li>Bug reports or broken tools</li>
          <li>Requests for new tools</li>
          <li>Partnership and integration ideas</li>
          <li>Press and media</li>
          <li>Privacy or data deletion requests</li>
        </ul>

        <h2>Want to be notified about the API?</h2>
        <p>
          Email us with the subject line &quot;API early access&quot; and
          we&apos;ll add you to the launch list.
        </p>
      </PageShell>
    </>
  );
}
