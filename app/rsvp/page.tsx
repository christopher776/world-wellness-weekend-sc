import { Mail, Bell, Users } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

const description =
  "Sign up for World Wellness Weekend South Carolina updates — sponsorship deadlines, class schedules, and registration openings for the September 18-19, 2026 event in Charleston, SC.";

export const metadata: Metadata = {
  title: "RSVP & Updates",
  description,
  alternates: { canonical: "/rsvp" },
  openGraph: {
    title: `RSVP & Updates | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/rsvp`,
  },
};

export default function RsvpPage() {
  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Stay In The Loop
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            RSVP &amp; Get Event Updates
          </h1>
          <p className="mt-4 text-navy-600">
            Whether you&apos;re considering sponsorship, want to teach a
            class, or just want to know when registration opens — sign up
            below and we&apos;ll keep you posted.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <RsvpForm />
      </section>

      <section className="bg-navy-800 py-16 text-cream-100">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <Bell className="h-6 w-6 text-gold-400" />
            <p className="font-serif font-bold">Be the First to Know</p>
            <p className="text-sm text-navy-100">
              Early bird sponsorship deadlines, class schedules, and
              registration openings.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Users className="h-6 w-6 text-gold-400" />
            <p className="font-serif font-bold">Join the Community</p>
            <p className="text-sm text-navy-100">
              Connect with South Carolina&apos;s spa, wellness &amp; hospitality
              professionals.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Mail className="h-6 w-6 text-gold-400" />
            <p className="font-serif font-bold">Direct Line</p>
            <p className="text-sm text-navy-100">
              Prefer email? Reach us at{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="underline hover:text-gold-400"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
