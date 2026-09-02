import Link from "next/link";
import { Flame, ArrowRight, Lock } from "lucide-react";
import { CountdownTimer } from "@/components/countdown-timer";
import { vipTicket } from "@/lib/data";

// The event's actual start — 8:00 AM Eastern on the first day. Used site-wide
// as the natural "doors close" deadline for VIP ticket urgency messaging.
export const VIP_EVENT_START_ISO = "2026-09-18T08:00:00-04:00";

interface VipFomoSectionProps {
  eyebrow?: string;
  heading?: string;
  ctaLabel?: string;
  className?: string;
}

/**
 * Reusable VIP-ticket urgency/FOMO block — used on the homepage and the
 * Sponsorship ("Reserve Your Place") page to drive VIP ticket sales. Always
 * links through to /vip-tickets, where the full urgency treatment (hero
 * badge + countdown + scarcity note) lives.
 */
export function VipFomoSection({
  eyebrow = "Strictly Limited",
  heading = "Don't Miss the VIP Experience",
  ctaLabel = "Reserve Your VIP Ticket",
  className = "",
}: VipFomoSectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-20 text-center text-cream-100 ${className}`}
    >
      <div className="mx-auto max-w-3xl px-6">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-red-300 ring-1 ring-red-400/40">
          <Flame className="h-3.5 w-3.5" />
          {eyebrow} &mdash; Only {vipTicket.ticketsAvailable} VIP Tickets, Ever
        </span>
        <h2 className="font-serif text-3xl font-bold md:text-4xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-xl text-navy-100">{vipTicket.description}</p>
        <p className="mt-6 font-serif text-5xl font-bold text-gold-400">{vipTicket.price}</p>

        <div className="mt-8">
          <CountdownTimer
            targetDate={VIP_EVENT_START_ISO}
            label="VIP Access Closes When the Weekend Begins"
            doneLabel="VIP check-in is open now!"
          />
        </div>

        <div className="mx-auto mt-8 max-w-xs">
          <Link
            href="/vip-tickets"
            className="inline-flex w-full animate-pulse items-center justify-center gap-2 rounded-md bg-gold-600 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-navy-900 shadow-lg shadow-gold-600/20 transition-colors hover:animate-none hover:bg-gold-700"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-navy-300">
          <Lock className="h-3 w-3" /> Capped at {vipTicket.ticketsAvailable} tickets for the
          entire weekend &mdash; no exceptions, no reprints.
        </p>
      </div>
    </section>
  );
}
