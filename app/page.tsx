import Link from "next/link";
import {
  Calendar,
  MapPin,
  Sparkles,
  Users,
  Heart,
  ArrowRight,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { StatBadge } from "@/components/stat-badge";
import { PaymentButton } from "@/components/payment-button";
import { Logo } from "@/components/logo";
import {
  importantDates,
  sponsorTiers,
  wellnessClasses,
  whyCharleston,
} from "@/lib/data";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-200 via-cream-100 to-cream-100">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-14 text-center md:pt-20">
          <div className="mb-8 flex justify-center">
            <Logo asLink={false} imageClassName="w-[220px] md:w-[260px]" />
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Wellness. Community. Carolina.
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl font-bold leading-tight text-navy-800 md:text-6xl">
            World Wellness Weekend, South Carolina
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg text-navy-600">
            All in one place — lasting connections, inspiration for every
            body, and a healthier future for our community. Charleston, SC —
            September 18&ndash;19, 2026.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sponsorship"
              className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-cream-100 hover:bg-navy-600 transition-colors"
            >
              View Sponsorship Tiers <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/hotel-travel"
              className="inline-flex items-center gap-2 rounded-md border-2 border-navy-800 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-navy-800 hover:bg-navy-50 transition-colors"
            >
              Hotel &amp; Travel
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <StatBadge icon={Calendar} label="Event Dates" value="Sep 18–19, 2026" />
            <StatBadge icon={MapPin} label="Location" value="Charleston, SC" />
            <StatBadge icon={Sparkles} label="Early Bird Deadline" value="July 30, 2026" />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Sponsorship & Exhibitor Opportunities"
          title="Every level includes a founding membership"
          subtitle="Join the inaugural South Carolina Spa & Wellness Association as a Founding Member — membership begins January 1, 2027."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sponsorTiers.map((tier) => (
            <div
              key={tier.slug}
              className="rounded-xl border border-navy-100 bg-white p-6 text-center shadow-sm"
            >
              <p className="font-serif text-lg font-bold text-navy-800">
                {tier.name}
              </p>
              <p className="mt-2 text-2xl font-bold text-gold-700">
                {tier.price}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-navy-400">
                {tier.space}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/sponsorship"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
          >
            See full sponsorship benefits &amp; reserve <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Wellness classes */}
      <section className="bg-navy-800 py-20 text-cream-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                Wellness Class Opportunities
              </p>
              <h2 className="font-serif text-3xl font-bold md:text-4xl">
                No fee to host a class
              </h2>
              <p className="mt-5 text-navy-100">
                Classes are offered on a donation basis, with proceeds split
                equally — 50% to the instructor or presenting organization,
                50% to The Spa of Charleston, event host. Showcase your
                expertise, grow your business, and support our community.
              </p>
              <div className="mt-8 flex gap-6">
                <div className="rounded-lg border border-navy-600 px-6 py-4 text-center">
                  <p className="font-serif text-2xl font-bold text-gold-400">50%</p>
                  <p className="text-xs text-navy-100">Instructor</p>
                </div>
                <div className="rounded-lg border border-navy-600 px-6 py-4 text-center">
                  <p className="font-serif text-2xl font-bold text-gold-400">50%</p>
                  <p className="text-xs text-navy-100">Event Host</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {wellnessClasses.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-gold-400/40 bg-navy-600 px-4 py-2 text-sm text-cream-100"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Charleston */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Why Charleston?" title="The perfect backdrop for wellness" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {whyCharleston.map((reason) => (
            <div
              key={reason}
              className="flex items-start gap-3 rounded-lg border border-navy-100 bg-white p-5"
            >
              <Heart className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <p className="text-sm text-navy-600">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important dates */}
      <section className="bg-cream-200 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading eyebrow="Mark Your Calendar" title="Important Dates" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {importantDates.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between rounded-lg border border-gold-100 bg-white px-6 py-4"
              >
                <span className="text-sm text-navy-600">{d.label}</span>
                <span className="font-serif font-bold text-navy-800">{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Users className="mx-auto mb-4 h-8 w-8 text-gold-600" />
        <h2 className="font-serif text-3xl font-bold text-navy-800">
          Let&apos;s Celebrate Wellness. Together.
        </h2>
        <p className="mt-4 text-navy-400">
          Spaces are limited — reserve early to secure your preferred sponsorship
          level and exhibit placement.
        </p>
        <div className="mx-auto mt-8 max-w-xs">
          <PaymentButton
            linkId={sponsorTiers[0].linkId}
            label="Reserve Your Place Today"
          />
        </div>
      </section>
    </div>
  );
}
