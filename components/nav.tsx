"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/sponsorship", label: "Sponsorship" },
  { href: "/rentals", label: "Rentals" },
  { href: "/hotel-travel", label: "Hotel & Travel" },
  { href: "/association", label: "Association" },
  { href: "/rsvp", label: "RSVP & Updates" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold-100 bg-cream-100/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          aria-label="World Wellness Weekend, South Carolina — home"
          className="flex items-center gap-3"
        >
          <Logo type="mark" asLink={false} imageClassName="w-10" />
          <span className="leading-tight">
            <span className="block font-serif text-base font-bold tracking-wide text-navy-800">
              WORLD WELLNESS WEEKEND
            </span>
            <span className="block text-[11px] uppercase tracking-[0.25em] text-gold-700">
              South Carolina
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium uppercase tracking-wide text-navy-600 hover:text-gold-700 transition-colors",
                pathname === item.href && "text-gold-700"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/sponsorship"
            className="rounded-md bg-navy-800 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cream-100 hover:bg-navy-600 transition-colors"
          >
            Reserve Your Place
          </Link>
        </nav>

        <button
          className="md:hidden text-navy-800"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gold-100 bg-cream-100 px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block text-sm font-medium uppercase tracking-wide text-navy-600",
                pathname === item.href && "text-gold-700"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/sponsorship"
            onClick={() => setOpen(false)}
            className="block rounded-md bg-navy-800 px-5 py-2 text-center text-sm font-semibold uppercase tracking-wide text-cream-100"
          >
            Reserve Your Place
          </Link>
        </nav>
      )}
    </header>
  );
}
