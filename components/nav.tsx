"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

interface NavLink {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  children: NavLink[];
}

type NavEntry = NavLink | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const navStructure: NavEntry[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  {
    label: "Event",
    children: [
      { href: "/teachers", label: "Meet Our Teachers" },
      { href: "/sponsors", label: "Sponsor Profiles" },
      { href: "/schedule", label: "Schedule of Events" },
      { href: "/vip-tickets", label: "VIP Tickets" },
      { href: "/hotel-travel", label: "Hotel & Travel" },
    ],
  },
  {
    label: "Get Involved",
    children: [
      { href: "/sponsorship", label: "Sponsorship & Exhibitors" },
      { href: "/teach-a-class", label: "Teach a Class" },
      { href: "/rentals", label: "Room Rentals" },
    ],
  },
  { href: "/association", label: "Association" },
  { href: "/rsvp", label: "RSVP & Updates" },
];

function groupContainsPath(group: NavGroup, pathname: string): boolean {
  return group.children.some((c) => c.href === pathname);
}

function DesktopDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  const active = groupContainsPath(group, pathname);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onFocus={handleEnter}
        onBlur={handleLeave}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-navy-600 hover:text-gold-700 transition-colors",
          active && "text-gold-700"
        )}
      >
        {group.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-60 rounded-lg border border-gold-100 bg-white py-2 shadow-lg">
          {group.children.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2 text-sm text-navy-600 hover:bg-cream-100 hover:text-gold-700",
                pathname === item.href && "text-gold-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileGroup({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(() => groupContainsPath(group, pathname));

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-medium uppercase tracking-wide text-navy-600"
      >
        {group.label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-2 space-y-2 border-l border-gold-100 pl-4">
          {group.children.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "block text-sm text-navy-500",
                pathname === item.href && "text-gold-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold-100 bg-cream-100/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          aria-label="South Carolina Wellness Weekend — home"
          className="flex items-center gap-3"
        >
          <Logo type="mark" asLink={false} imageClassName="w-10" />
          <span className="leading-tight">
            <span className="block font-serif text-base font-bold tracking-wide text-navy-800">
              SOUTH CAROLINA WELLNESS WEEKEND
            </span>
            <span className="block text-[11px] uppercase tracking-[0.25em] text-gold-700">
              South Carolina
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navStructure.map((entry) =>
            isGroup(entry) ? (
              <DesktopDropdown key={entry.label} group={entry} pathname={pathname} />
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                className={cn(
                  "text-sm font-medium uppercase tracking-wide text-navy-600 hover:text-gold-700 transition-colors",
                  pathname === entry.href && "text-gold-700"
                )}
              >
                {entry.label}
              </Link>
            )
          )}
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
        <nav className="md:hidden border-t border-gold-100 bg-cream-100 px-6 py-4 space-y-4">
          {navStructure.map((entry) =>
            isGroup(entry) ? (
              <MobileGroup
                key={entry.label}
                group={entry}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block text-sm font-medium uppercase tracking-wide text-navy-600",
                  pathname === entry.href && "text-gold-700"
                )}
              >
                {entry.label}
              </Link>
            )
          )}
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
