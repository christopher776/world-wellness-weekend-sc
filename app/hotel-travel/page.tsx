import { Building, MapPin, Heart, Award, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { whyCharleston, charlestonImages, francisMarionHotel } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

const description =
  "Where to stay for South Carolina Wellness Weekend, Charleston SC — host hotel The Francis Marion Hotel, a Historic Hotels of America member since 1999, plus the event's ballrooms and why Charleston is the perfect backdrop for wellness.";

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
      <section className="relative overflow-hidden bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Hotel &amp; Travel
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            Stay in the Heart of Historic Charleston
          </h1>
        </div>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={charlestonImages.historicStreet}
        alt="A historic Charleston, South Carolina street lined with pastel-colored row houses and palmetto trees"
        className="h-64 w-full object-cover sm:h-80 md:h-96"
      />

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
            <p className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-700">
              <Award className="h-3.5 w-3.5" />
              Historic Hotels of America Member Since {francisMarionHotel.historicHotelsOfAmericaSince}
            </p>
            <p className="mt-4 text-sm text-navy-600">
              Built in {francisMarionHotel.yearBuilt} in the heart of Charleston&apos;s Historic
              District overlooking Marion Square, the Francis Marion is a {francisMarionHotel.architecture}{" "}
              landmark added to the National Register of Historic Places in{" "}
              {francisMarionHotel.nationalRegisterYear}. Its {francisMarionHotel.roomCount} guest
              rooms and grand ballrooms have made it a premier gathering place in Charleston for a
              century.
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm text-navy-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              387 King Street, Charleston, SC 29403
            </p>
            <p className="mt-4 text-sm text-navy-600">
              Special room rate available for South Carolina Wellness Weekend guests.
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

      {/* Event space */}
      <section className="bg-navy-800 py-20 text-cream-100">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              Inside the Francis Marion
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">The Event Space</h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-100">
              South Carolina Wellness Weekend takes place across the Francis Marion&apos;s
              historic ballrooms — from the VIP Opening Night Party to speaker sessions and
              classes throughout the weekend.
            </p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={charlestonImages.ballroom}
            alt="An elegant historic ballroom with crystal chandeliers, representative of the Francis Marion Hotel's event spaces"
            className="mb-12 h-64 w-full rounded-xl object-cover sm:h-80"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {francisMarionHotel.eventSpaces.map((space) => (
              <div
                key={space.name}
                className="relative rounded-xl border border-gold-400/30 bg-navy-600/40 p-6"
              >
                {space.isVip && (
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-400">
                    <Sparkles className="h-3 w-3" /> VIP Opening Night
                  </span>
                )}
                <h3 className="font-serif text-lg font-bold">{space.name}</h3>
                <p className="mt-2 text-sm text-navy-100">{space.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-400">
                  {space.occupancy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting around Charleston */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={charlestonImages.carriageTour}
            alt="A horse-drawn carriage tour on a historic Charleston, South Carolina street"
            className="h-64 w-full rounded-xl object-cover sm:h-80 md:order-2"
          />
          <div>
            <SectionHeading
              eyebrow="Getting Around"
              title="Explore Historic Charleston"
              align="left"
            />
            <p className="text-sm text-navy-600">
              The Francis Marion sits directly on Marion Square in the middle of Charleston&apos;s
              walkable Historic District — steps from King Street shopping, award-winning
              restaurants, horse-drawn carriage tours, and the Charleston waterfront. Plan to
              arrive a day early or stay a day later to explore everything the city has to offer.
            </p>
          </div>
        </div>
      </section>

      {/* Charleston at large */}
      <section className="bg-cream-200 py-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={charlestonImages.waterfront}
          alt="The Charleston, South Carolina waterfront at sunset"
          className="mx-auto h-64 w-full max-w-5xl rounded-xl object-cover sm:h-80"
        />
      </section>
    </div>
  );
}
