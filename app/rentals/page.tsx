import { Check, Clock } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { PaymentButton } from "@/components/payment-button";
import { rentals } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

const description =
  "Treatment Room and Business Room rentals at World Wellness Weekend, Charleston, SC. Host private consultations, CEC workshops, or business trainings during the event.";

export const metadata: Metadata = {
  title: "Room Rentals",
  description,
  alternates: { canonical: "/rentals" },
  openGraph: {
    title: `Room Rentals | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/rentals`,
  },
};

export default function RentalsPage() {
  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Enhance Your Presence
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            Additional Rental Options
          </h1>
          <p className="mt-4 text-navy-600">
            Spaces are limited — reserve early to secure your preferred time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-navy-100 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-navy-800">
              {rentals.treatmentRoom.name}
            </h2>
            <p className="mt-2 text-3xl font-bold text-gold-700">
              {rentals.treatmentRoom.price}
              <span className="ml-2 text-sm font-normal uppercase tracking-wide text-navy-400">
                {rentals.treatmentRoom.unit}
              </span>
            </p>
            <p className="mt-5 text-sm text-navy-600">
              {rentals.treatmentRoom.description}
            </p>
            <div className="mt-8 max-w-xs">
              <PaymentButton
                linkId={rentals.treatmentRoom.linkId}
                label="Reserve Treatment Room"
              />
            </div>
          </div>

          <div className="rounded-xl border border-navy-100 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-navy-800">
              {rentals.businessRoom.name}
            </h2>
            <p className="mt-2 text-3xl font-bold text-gold-700">
              $500&ndash;$750
            </p>
            <p className="mt-5 text-sm text-navy-600">
              {rentals.businessRoom.description}
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-navy-400">
              Perfect For
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {rentals.businessRoom.perfectFor.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rentals.businessRoom.options.map((opt) => (
                <PaymentButton
                  key={opt.linkId}
                  linkId={opt.linkId}
                  label={`Reserve — ${opt.price}`}
                  variant={opt.price === "$750" ? "solid" : "outline"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-800 py-14 text-center text-cream-100">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-6">
          <Clock className="h-6 w-6 text-gold-400" />
          <p className="font-serif text-xl font-bold">Spaces are Limited!</p>
          <p className="text-sm text-navy-100">
            Reserve early to secure your preferred time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <SectionHeading eyebrow="Plan Ahead" title="Important Dates" />
        <p className="text-center text-sm text-navy-600">
          Early Bird Sponsorship Deadline: July 30, 2026 · Vendor
          Reservations Close: August 15, 2026 · Final Artwork &amp; Payment
          Due: August 30, 2026 · Event Dates: September 18&ndash;19, 2026
        </p>
      </section>
    </div>
  );
}
