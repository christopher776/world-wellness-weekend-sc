import { Building, MapPin, Heart } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { whyCharleston } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

const description =
  "Where to stay for World Wellness Weekend, Charleston SC — host hotel The Francis Marion Hotel, plus why Charleston is the perfect backdrop for wellness and community.";

export const metadata: Metadata = {
  title: "Hotel & Travel",
  description,
  alternates: { canonical: "/hotel-travel" },
  openGraph: {
    title: `Hotel & Travel | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/hotel-travel`,
  },
};

export default function HotelTravelPage() {
  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Hotel &amp; Travel
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            Stay in the Heart of Historic Charleston
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div className="rounded-xl border border-navy-100 bg-white p-8 shadow-sm">
            <Building className="h-8 w-8 text-gold-600" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-700">
              Host Hotel
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-navy-800">
              The Francis Marion Hotel
            </h2>
            <p className="mt-4 flex items-start gap-2 text-sm text-navy-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              387 King Street, Charleston, SC 29403
            </p>
            <p className="mt-4 text-sm text-navy-600">
              Special room rate available for World Wellness Weekend guests.
              Contact the hotel directly and reference the event to book at
              the discounted rate.
            </p>
            <a
              href="tel:+18437232500"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-navy-800 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream-100 hover:bg-navy-600 transition-colors"
            >
              Book Your Room
            </a>
          </div>

          <div>
            <SectionHeading
              eyebrow="Why Charleston?"
              title="A perfect wellness backdrop"
              align="left"
            />
            <div className="space-y-4">
              {whyCharleston.map((reason) => (
                <div key={reason} className="flex items-start gap-3">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <p className="text-sm text-navy-600">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
