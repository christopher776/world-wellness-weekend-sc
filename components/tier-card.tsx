import { Check } from "lucide-react";
import { PaymentButton } from "@/components/payment-button";
import { SponsorTier } from "@/lib/data";
import { cn } from "@/lib/utils";

export function TierCard({ tier }: { tier: SponsorTier }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md",
        tier.featured
          ? "border-gold-600 ring-1 ring-gold-600"
          : "border-navy-100"
      )}
    >
      {tier.featured && (
        <span className="mb-4 inline-block w-fit rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
          Featured Tier
        </span>
      )}
      <h3 className="font-serif text-xl font-bold text-navy-800">
        {tier.name}
      </h3>
      <p className="mt-2 text-3xl font-bold text-navy-800">{tier.price}</p>
      <p className="mt-1 text-sm uppercase tracking-wide text-gold-700">
        {tier.space}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2 text-sm text-navy-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-md bg-navy-50 px-3 py-2 text-xs text-navy-600">
        Includes an inaugural South Carolina Spa &amp; Wellness Association
        Founding Membership (begins January 1, 2027).
      </p>

      <PaymentButton
        linkId={tier.linkId}
        label={`Reserve ${tier.name}`}
        className="mt-6"
      />
    </div>
  );
}
