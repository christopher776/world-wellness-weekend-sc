import type { Metadata } from "next";
import { Sparkles, Ticket } from "lucide-react";
import { PaymentButton } from "@/components/payment-button";
import { siteConfig } from "@/lib/site-config";
import { vipTicket } from "@/lib/data";

const description =
  "South Carolina Wellness Weekend VIP Experience — $100, 100 tickets available. Priority access, a VIP reception, and exclusive experiences in Charleston, SC.";

export const metadata: Metadata = {
  title: "VIP Tickets",
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
];

export default function VipTicketsPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-navy-800 to-navy-900 py-20 text-center text-cream-100">
        <div className="mx-auto max-w-3xl px-6">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-gold-400" />
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            South Carolina Wellness Weekend
          </p>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">VIP Experience</h1>
          <p className="mt-6 font-serif text-5xl font-bold text-gold-400">{vipTicket.price}</p>
          <p className="mt-2 text-sm text-navy-100">
            {vipTicket.ticketsAvailable} tickets available · September 18&ndash;19, 2026 ·
            Charleston, SC
          </p>
          <p className="mx-auto mt-6 max-w-xl text-navy-100">{vipTicket.description}</p>
          <div className="mx-auto mt-8 max-w-xs">
            <PaymentButton linkId={vipTicket.linkId} label="Reserve Your VIP Ticket" />
          </div>
        </div>
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
        <div className="mx-auto max-w-xs">
          <PaymentButton linkId={vipTicket.linkId} label="Reserve Your VIP Ticket" />
        </div>
      </section>
    </div>
  );
}
