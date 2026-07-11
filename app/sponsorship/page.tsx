import { Star, Check } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { TierCard } from "@/components/tier-card";
import { PaymentButton } from "@/components/payment-button";
import { sponsorTiers, vipLounge } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

const description =
  "Sponsorship & exhibitor tiers for World Wellness Weekend, South Carolina — Founding Partner ($200), Gold ($750), Platinum ($1,500), Diamond ($2,000), and the VIP Rest & Restore Lounge ($8,000). Reserve your place in Charleston, SC.";

export const metadata: Metadata = {
  title: "Sponsorship & Exhibitor Opportunities",
  description,
  alternates: { canonical: "/sponsorship" },
  openGraph: {
    title: `Sponsorship & Exhibitor Opportunities | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/sponsorship`,
  },
};

export default function SponsorshipPage() {
  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Sponsorship &amp; Exhibitor Opportunities
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            Reserve Your Place at World Wellness Weekend
          </h1>
          <p className="mt-4 text-navy-600">
            Every level includes an inaugural South Carolina Spa &amp;
            Wellness Association Founding Membership — membership begins
            January 1, 2027. All payments are processed securely through
            Authorize.Net.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sponsorTiers.map((tier) => (
            <TierCard key={tier.slug} tier={tier} />
          ))}
        </div>
      </section>

      <section className="bg-navy-800 py-20 text-cream-100">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-10 rounded-2xl border border-gold-400/30 bg-navy-600/40 p-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gold-400">
                <Star className="h-3.5 w-3.5" /> {vipLounge.subtitle}
              </span>
              <h2 className="font-serif text-3xl font-bold">{vipLounge.name}</h2>
              <p className="mt-2 font-serif text-4xl font-bold text-gold-400">
                {vipLounge.price}
              </p>
              <p className="mt-4 text-navy-100">
                Create the signature relaxation experience for VIPs,
                speakers, sponsors &amp; industry leaders.
              </p>
              <div className="mt-8 max-w-xs">
                <PaymentButton
                  linkId={vipLounge.linkId}
                  label="Sponsor the VIP Lounge"
                />
              </div>
            </div>
            <ul className="space-y-3">
              {vipLounge.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-navy-100">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <SectionHeading
          eyebrow="Questions?"
          title="Need help choosing a sponsorship level?"
          subtitle="Reach out to Dayleann@LuxwellSolutions.com — spaces are limited, so reserve early to maximize visibility and take advantage of all promotional opportunities."
        />
      </section>
    </div>
  );
}
