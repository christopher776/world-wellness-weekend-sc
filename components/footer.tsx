import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import { NewsletterSignup } from "@/components/newsletter-signup";

export function Footer() {
  return (
    <footer className="border-t border-gold-100 bg-navy-900 text-cream-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo variant="light" type="full" asLink={false} imageClassName="w-[140px]" />
            <p className="mt-4 text-sm text-navy-100">
              SPA Sigma Rho Alpha Wellness Fraternity
              <br />
              South Carolina Spa &amp; Wellness Association
              <br />
              Launching January 1, 2027
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Explore
            </p>
            <ul className="space-y-2 text-sm text-navy-100">
              <li><Link href="/sponsorship" className="hover:text-gold-400">Sponsorship &amp; Exhibitors</Link></li>
              <li><Link href="/rentals" className="hover:text-gold-400">Room Rentals</Link></li>
              <li><Link href="/hotel-travel" className="hover:text-gold-400">Hotel &amp; Travel</Link></li>
              <li><Link href="/association" className="hover:text-gold-400">SC Spa &amp; Wellness Association</Link></li>
              <li><Link href="/rsvp" className="hover:text-gold-400">RSVP &amp; Updates</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-navy-100">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-400" />
                Dayleann@LuxwellSolutions.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-400" />
                Charleston, South Carolina
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Get Updates
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-navy-600 pt-6 text-center text-xs text-navy-100">
          <p>Let&apos;s Celebrate Wellness. Together. Reserve your place today.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="underline hover:text-gold-400">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="underline hover:text-gold-400">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
