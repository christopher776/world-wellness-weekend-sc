"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Gavel, Loader2, ShieldCheck, Trophy } from "lucide-react";
import type { AuctionItem } from "@/lib/auction";

interface ItemStatus {
  itemId: string;
  currentBid: number;
  minimumNextBid: number;
  bidCount: number;
}

function money(value: number | string) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(number);
}

function dateTime(value: string) {
  if (!value) return "To be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(date);
}

export function AuctionExperience({
  items,
  initialStatus,
}: {
  items: AuctionItem[];
  initialStatus: ItemStatus[];
}) {
  const [status, setStatus] = useState<ItemStatus[]>(initialStatus);
  const [token, setToken] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [biddingItem, setBiddingItem] = useState("");
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedToken = window.localStorage.getItem("scwellness-auction-token") || "";
    const storedName = window.localStorage.getItem("scwellness-auction-name") || "";
    setToken(storedToken);
    setDisplayName(storedName);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch("/api/auction/status", { cache: "no-store" });
        const data = await response.json();
        if (response.ok && data.ok && Array.isArray(data.status)) setStatus(data.status);
      } catch {
        // Keep the last known status if a refresh fails.
      }
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  const statusMap = useMemo(() => new Map(status.map((entry) => [entry.itemId, entry])), [status]);

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegistering(true);
    setRegistrationError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auction/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          website: form.get("website"),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data?.error || "Registration failed.");
      setToken(data.token);
      setDisplayName(data.bidder.displayName);
      window.localStorage.setItem("scwellness-auction-token", data.token);
      window.localStorage.setItem("scwellness-auction-name", data.bidder.displayName);
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setRegistering(false);
    }
  }

  async function placeBid(item: AuctionItem) {
    if (!token) {
      document.getElementById("auction-registration")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const itemStatus = statusMap.get(item.ID);
    const amount = Number(bidAmounts[item.ID] || itemStatus?.minimumNextBid || item.StartingBid);
    setBiddingItem(item.ID);
    setMessage((previous) => ({ ...previous, [item.ID]: "" }));
    try {
      const response = await fetch("/api/auction/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, itemId: item.ID, amount }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data?.error || "Bid could not be placed.");
      setStatus((previous) => previous.map((entry) => entry.itemId === item.ID ? {
        ...entry,
        currentBid: data.currentBid,
        minimumNextBid: data.minimumNextBid,
        bidCount: entry.bidCount + 1,
      } : entry));
      setBidAmounts((previous) => ({ ...previous, [item.ID]: String(data.minimumNextBid) }));
      setMessage((previous) => ({ ...previous, [item.ID]: `Bid accepted at ${money(data.currentBid)}.` }));
    } catch (error) {
      setMessage((previous) => ({ ...previous, [item.ID]: error instanceof Error ? error.message : "Bid could not be placed." }));
    } finally {
      setBiddingItem("");
    }
  }

  return (
    <>
      <section id="auction-registration" className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-2xl border border-gold-200 bg-white p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-gold-700"><ShieldCheck className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">Bidder Registration</span></div>
            <h2 className="mt-2 font-serif text-2xl font-bold text-navy-800">{token ? `Registered as ${displayName}` : "Register once, then bid on any item"}</h2>
            <p className="mt-2 text-sm leading-6 text-navy-600">Your contact information is used to identify winning bidders and coordinate payment or pickup. Public bidding displays only your first name and last initial.</p>
          </div>
          {!token && (
            <form onSubmit={register} className="mt-6 grid min-w-0 flex-1 gap-3 md:mt-0 md:max-w-md md:grid-cols-2">
              <input name="name" required placeholder="Full name" className="rounded-md border border-navy-100 px-3 py-2.5 text-sm md:col-span-2" />
              <input name="email" type="email" required placeholder="Email" className="rounded-md border border-navy-100 px-3 py-2.5 text-sm" />
              <input name="phone" type="tel" required placeholder="Mobile phone" className="rounded-md border border-navy-100 px-3 py-2.5 text-sm" />
              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              {registrationError && <p className="text-sm text-red-600 md:col-span-2">{registrationError}</p>}
              <button disabled={registering} className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-cream-100 md:col-span-2">
                {registering && <Loader2 className="h-4 w-4 animate-spin" />} Register to Bid
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const itemStatus = statusMap.get(item.ID);
          const current = itemStatus?.currentBid ?? Number(item.StartingBid || 0);
          const minimum = itemStatus?.minimumNextBid ?? current + Number(item.BidIncrement || 5);
          const close = item.ClosesAt ? new Date(item.ClosesAt) : null;
          const closed = close && !Number.isNaN(close.getTime()) ? Date.now() >= close.getTime() : false;
          return (
            <article key={item.ID} className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${item.Featured === "TRUE" ? "border-gold-400 ring-1 ring-gold-200" : "border-navy-100"}`}>
              {item.PhotoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.PhotoURL} alt={item.Title} className="h-56 w-full object-cover" />
              ) : <div className="flex h-56 items-center justify-center bg-cream-200 text-gold-600"><Gavel className="h-10 w-10" /></div>}
              <div className="p-6">
                {item.Featured === "TRUE" && <p className="mb-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-gold-700"><Trophy className="h-3.5 w-3.5" /> Featured</p>}
                <h3 className="font-serif text-2xl font-bold text-navy-800">{item.Title}</h3>
                {item.DonorName && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy-400">Donated by {item.DonorName}</p>}
                {item.Description && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-navy-600">{item.Description}</p>}
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-cream-100 p-4">
                  <div><p className="text-[11px] uppercase tracking-wide text-navy-400">Current bid</p><p className="font-serif text-xl font-bold text-navy-800">{money(current)}</p></div>
                  <div><p className="text-[11px] uppercase tracking-wide text-navy-400">Retail value</p><p className="font-semibold text-navy-700">{item.RetailValue ? money(item.RetailValue) : "—"}</p></div>
                  <div><p className="text-[11px] uppercase tracking-wide text-navy-400">Bids</p><p className="font-semibold text-navy-700">{itemStatus?.bidCount ?? 0}</p></div>
                  <div><p className="text-[11px] uppercase tracking-wide text-navy-400">Closes</p><p className="text-xs font-semibold text-navy-700">{dateTime(item.ClosesAt)}</p></div>
                </div>

                {!closed ? (
                  <div className="mt-5">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Your bid · minimum {money(minimum)}</label>
                    <div className="flex gap-2">
                      <input type="number" min={minimum} step={Number(item.BidIncrement || 5)} value={bidAmounts[item.ID] ?? String(minimum)} onChange={(e) => setBidAmounts((previous) => ({ ...previous, [item.ID]: e.target.value }))} className="min-w-0 flex-1 rounded-md border border-navy-100 px-3 py-2.5 text-sm" />
                      <button onClick={() => placeBid(item)} disabled={biddingItem === item.ID} className="inline-flex items-center gap-2 rounded-md bg-gold-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-gold-700 disabled:opacity-60">
                        {biddingItem === item.ID && <Loader2 className="h-4 w-4 animate-spin" />} Bid
                      </button>
                    </div>
                  </div>
                ) : <p className="mt-5 rounded-md bg-navy-50 px-4 py-3 text-center text-sm font-semibold text-navy-700">Bidding closed</p>}

                {message[item.ID] && <p className={`mt-3 text-sm ${message[item.ID].startsWith("Bid accepted") ? "text-green-700" : "text-red-600"}`}>{message[item.ID]}</p>}
                {item.PickupDetails && <p className="mt-5 text-xs leading-5 text-navy-500"><strong>Fulfillment:</strong> {item.PickupDetails}</p>}
                {item.Terms && <p className="mt-2 text-xs leading-5 text-navy-500"><strong>Terms:</strong> {item.Terms}</p>}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
