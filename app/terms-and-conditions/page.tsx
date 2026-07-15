import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

const description =
  "Terms & Conditions for World Wellness Weekend, South Carolina, presented by the South Carolina Spa & Wellness Association.";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description,
  alternates: { canonical: "/terms-and-conditions" },
  openGraph: {
    title: `Terms & Conditions | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/terms-and-conditions`,
  },
  robots: { index: true, follow: true },
};

const terms = [
  "All event content and materials are the property of the South Carolina Spa and Wellness Association.",
  "Registration fees are non-refundable, and the South Carolina Spa and Wellness Association reserves the right to refuse or terminate participation.",
  "Participants must adhere to a professional code of conduct.",
  "The South Carolina Spa and Wellness Association is not liable for any loss or injury during the event.",
  "Any changes to the event will be communicated to participants.",
];

export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
        Policy
      </p>
      <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
        Terms &amp; Conditions
      </h1>
      <p className="mt-3 text-sm text-navy-400">Effective July 14, 2026</p>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-navy-600">
        <p>
          By participating in World Wellness Weekend, South Carolina, you
          agree to the following terms:
        </p>

        <ol className="space-y-4">
          {terms.map((term, i) => (
            <li
              key={term}
              className="flex items-start gap-4 rounded-lg border border-navy-100 bg-white p-5"
            >
              <span className="font-serif text-lg font-bold text-gold-700">
                {i + 1}
              </span>
              <span>{term}</span>
            </li>
          ))}
        </ol>

        <p>
          For questions about these Terms &amp; Conditions, please contact
          us at{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-gold-700 underline hover:text-gold-600"
          >
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
