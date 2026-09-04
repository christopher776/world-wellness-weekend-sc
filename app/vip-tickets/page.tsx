import type { Metadata } from "next";
import { Sparkles, Ticket, Flame, Lock } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { FaqJsonLd } from "@/components/json-ld";
import { CountdownTimer } from "@/components/countdown-timer";
import { VIP_EVENT_START_ISO } from "@/components/vip-fomo-section";
import { siteConfig } from "@/lib/site-config";
import { vipTicket } from "@/lib/data";

const description =
  "South Carolina Wellness Weekend VIP Experience — $100, only 100 tickets available. Sign up and reserve priority access, a VIP reception, and exclusive experiences in Charleston, SC before they're gone.";

export const metadata: Metadata = {
  title: "VIP Tickets — Only 100 Available",
  description,
  alternates: { canonical: "/vip-tickets" },
  openGraph: {
    title: `VIP Tickets | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/vip-tickets`,
  },
};

const faqs = [
  {
    q: "Do I still need to register for individual classes?",
    a: "Yes — VIP grants priority access and exclusive perks, but individual classes and sessions still require their own registration through the Schedule of Events page.",
  },
  {
    q: "Will I receive a confirmation?",
    a: "Yes, you'll receive an email confirmation after purchase. Bring it (digital is fine) to VIP check-in.",
  },
  {
    q: "Is my ticket refundable?",
    a: "VIP tickets follow the event's standard refund, cancellation, and transfer policy — contact us if you have a specific circumstance.",
  },
  {
    q: "Is there an age restriction?",
    a: "The VIP experience is designed for adult guests. Contact us in advance if you have questions about bringing a minor.",
  },
  {
    q: "What happens if VIP tickets sell out?",
    a: "VIP access is strictly capped at 100 tickets for the entire weekend, with no reprints or additional releases. Once they're gone, they're gone — we recommend reserving early.",
  },
];

export default function VipTicketsPage() {
  return (
    <div>
      <FaqJsonLd faqs={faqs} />
      <section className="bg-gradient-to-b from-navy-800 to-navy-900 py-20 text-center text-cream-100">
        <div className="mx-auto max-w-3xl px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-red-300 ring-1 ring-red-400/40">
            <Flame className="h-3.5 w-3.5" /> Only {vipTicket.ticketsAvailable} VIP Tickets —
            Selling Fast
          </span>
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-gold-400" />
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            South Carolina Wellness Weekend
          </p>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">VIP Experience</h1>
          <p className="mt-6 font-serif text-5xl font-bold text-gold-400">{vipTicket.price}</p>
          <p className="mt-2 text-sm text-navy-100">
            {vipTicket.ticketsAvailable} tickets available, total &middot; September
            18&ndash;19, 2026 &middot; Charleston, SC
          </p>
          <p className="mx-auto mt-6 max-w-xl text-navy-100">{vipTicket.description}</p>

          <div className="mt-10">
            <CountdownTimer
              targetDate={VIP_EVENT_START_ISO}
              label="VIP Access Closes When the Weekend Begins"
              doneLabel="VIP check-in is open now!"
            />
          </div>

          <a
            href="#signup"
            className="mt-10 inline-flex animate-pulse items-center justify-center rounded-md bg-gold-600 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-navy-900 shadow-lg shadow-gold-600/20 transition-colors hover:animate-none hover:bg-gold-700"
          >
            Sign Up &amp; Reserve Your VIP Ticket
          </a>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-navy-300">
            <Lock className="h-3 w-3" /> Capped at {vipTicket.ticketsAvailable} tickets for the
            entire weekend &mdash; no exceptions, no reprints.
          </p>
        </div>
      </section>

      <section id="signup" className="scroll-mt-24 mx-auto max-w-3xl px-6 py-20">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Sign Up First
          </p>
          <h2 className="font-serif text-3xl font-bold text-navy-800">
            Tell Us a Bit About Yourself
          </h2>
          <p className="mt-3 text-navy-600">
            Sign up below and we&apos;ll present the option to purchase your VIP ticket right
            after — this also gets you on the list for event updates and class schedules.
            Don&apos;t wait — VIP is strictly capped and typically sells out ahead of the
            event.
          </p>
        </div>
        <RsvpForm defaultInterest="VIP Ticket Access" />
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {vipTicket.inclusions.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border border-navy-100 bg-white p-5">
              <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <p className="text-sm text-navy-600">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-navy-400">
          <p>
            Refund, cancellation, and transfer policy: contact {siteConfig.contactEmail} with any
            questions about your VIP ticket.
          </p>
        </div>
      </section>

      <section className="bg-cream-200 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-serif text-2xl font-bold text-navy-800">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-lg border border-gold-100 bg-white p-5">
                <p className="font-semibold text-navy-800">{f.q}</p>
                <p className="mt-2 text-sm text-navy-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-red-600 ring-1 ring-red-200">
          <Flame className="h-3.5 w-3.5" /> Only {vipTicket.ticketsAvailable} Tickets
        </span>
        <div>
          <a
            href="#signup"
            className="inline-flex animate-pulse items-center justify-center rounded-md bg-gold-600 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-navy-900 shadow-lg shadow-gold-600/20 transition-colors hover:animate-none hover:bg-gold-700"
          >
            Sign Up &amp; Reserve Your VIP Ticket
          </a>
        </div>
      </section>
    </div>
  );
}
