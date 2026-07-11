import { Check } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { associationBenefits, wellnessClasses } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

const description =
  "The South Carolina Spa & Wellness Association — a founding membership included with every World Wellness Weekend sponsorship level, launching January 1, 2027.";

export const metadata: Metadata = {
  title: "SC Spa & Wellness Association",
  description,
  alternates: { canonical: "/association" },
  openGraph: {
    title: `SC Spa & Wellness Association | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/association`,
  },
};

export default function AssociationPage() {
  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Launching January 1, 2027
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            South Carolina Spa &amp; Wellness Association
          </h1>
          <p className="mt-4 text-navy-600">
            Included with every sponsorship level of World Wellness Weekend.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <SectionHeading eyebrow="Founding Membership Benefits" title="What's Included" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {associationBenefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 rounded-lg border border-navy-100 bg-white p-5"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <span className="text-sm text-navy-600">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-navy-800 py-20 text-cream-100">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
            Wellness Class Opportunities
          </p>
          <h2 className="text-center font-serif text-3xl font-bold">
            Showcase your expertise. Grow your business.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-navy-100">
            No fee to host a class. Classes are offered on a donation basis,
            with proceeds divided equally: 50% to the instructor or
            presenting organization, 50% to The Spa of Charleston, event
            host.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {wellnessClasses.map((c) => (
              <span
                key={c}
                className="rounded-full border border-gold-400/40 bg-navy-600 px-4 py-2 text-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-navy-800">
          SPA Sigma Rho Alpha Wellness Fraternity
        </h2>
        <p className="mt-3 text-sm text-navy-600">
          Founding partner of the South Carolina Spa &amp; Wellness
          Association — supporting professional development and community
          throughout the state&apos;s wellness industry.
        </p>
      </section>
    </div>
  );
}
