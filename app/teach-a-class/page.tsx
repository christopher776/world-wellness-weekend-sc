import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CircleDollarSign,
  DoorOpen,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

const responderUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLScOB5TsDzCsF5K4srwUypUi86wRr1D6WI4bai0NjFs9CyhlEQ/viewform";

export const metadata: Metadata = {
  title: "Teach a Class",
  description:
    "Apply to teach a donation-based wellness class at World Wellness Weekend, South Carolina.",
  alternates: {
    canonical: "/teach-a-class",
  },
};

export default function TeachAClassPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-cream-200 to-cream-100">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Wellness Class Opportunities
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            Apply to Teach a Class
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-600">
            Share your expertise during World Wellness Weekend, South Carolina,
            September 18&ndash;19, 2026, in Charleston.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gold-100 bg-white p-5 shadow-sm">
              <DoorOpen className="mx-auto h-6 w-6 text-gold-700" />
              <p className="mt-3 font-semibold text-navy-800">Five class rooms</p>
            </div>
            <div className="rounded-xl border border-gold-100 bg-white p-5 shadow-sm">
              <CircleDollarSign className="mx-auto h-6 w-6 text-gold-700" />
              <p className="mt-3 font-semibold text-navy-800">50/50 donation split</p>
            </div>
            <div className="rounded-xl border border-gold-100 bg-white p-5 shadow-sm">
              <FileCheck2 className="mx-auto h-6 w-6 text-gold-700" />
              <p className="mt-3 font-semibold text-navy-800">Insurance required</p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-sm text-navy-500">
            The application requests a headshot, logo, and proof of liability
            insurance. Because files are uploaded to Google Drive, applicants
            must sign in to a Google account.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <div className="rounded-2xl border border-gold-100 bg-white px-6 py-10 text-center shadow-sm md:px-12 md:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-gold-700">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-6 font-serif text-3xl font-bold text-navy-800">
            Instructor Application
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-navy-600">
            The application opens securely in Google Forms. Sign in with a
            Google account to upload your headshot, logo, and proof of liability
            insurance.
          </p>
          <Link
            href={responderUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-navy-800 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2"
          >
            Open Instructor Application
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="mt-4 text-xs text-navy-500">
            The form will open in a new browser window.
          </p>
        </div>
      </section>
    </div>
  );
}
