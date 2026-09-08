import type { Metadata } from "next";
import { Gavel, HeartHandshake, ShieldAlert } from "lucide-react";
import { AuctionExperience } from "@/components/auction-experience";
import {
  bidCountForItem,
  currentBidForItem,
  fetchAuctionBids,
  fetchAuctionItems,
  minimumNextBid,
} from "@/lib/auction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wellness Weekend Auction | South Carolina Wellness Weekend",
  description:
    "Preview wellness experiences, products and packages supporting South Carolina Wellness Weekend.",
};

export default async function AuctionPage() {
  const biddingEnabled = process.env.AUCTION_BIDDING_ENABLED === "true";
  const [items, bids] = await Promise.all([
    fetchAuctionItems({ publishedOnly: true, revalidate: 0 }),
    fetchAuctionBids(0),
  ]);

  const initialStatus = items.map((item) => ({
    itemId: item.ID,
    currentBid: currentBidForItem(item, bids),
    minimumNextBid: minimumNextBid(item, bids),
    bidCount: bidCountForItem(item.ID, bids),
  }));

  return (
    <main className="min-h-screen bg-cream-100">
      <section className="border-b border-gold-100 bg-navy-800 px-6 py-16 text-center text-cream-100">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/50 bg-white/10">
            <Gavel className="h-7 w-7 text-gold-300" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-gold-300">South Carolina Wellness Weekend</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Wellness Auction</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-cream-200">
            Discover donated wellness experiences, products and packages supporting South Carolina Wellness Weekend event production.
          </p>
          {biddingEnabled ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-cream-200">
              <HeartHandshake className="h-4 w-4 text-gold-300" /> Register once · bid online · winners contacted after closing
            </div>
          ) : (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-white/10 px-4 py-2 text-xs text-cream-100">
              <ShieldAlert className="h-4 w-4 text-gold-300" /> Auction preview · live bidding opens after regulatory activation
            </div>
          )}
        </div>
      </section>

      {!biddingEnabled && (
        <section className="mx-auto max-w-4xl px-6 pt-10">
          <div className="rounded-xl border border-gold-200 bg-white p-6 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-navy-800">Auction catalog preview</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-navy-600">
              Items may be published for preview while South Carolina auction licensure and retail sales-tax setup are finalized. Registration and bidding are disabled until activation is complete.
            </p>
          </div>
        </section>
      )}

      {items.length === 0 ? (
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl font-bold text-navy-800">Auction items are coming soon.</h2>
          <p className="mt-3 text-navy-600">Check back for wellness experiences, products and packages from participating partners.</p>
        </section>
      ) : biddingEnabled ? (
        <div className="pt-10">
          <AuctionExperience items={items} initialStatus={initialStatus} />
        </div>
      ) : (
        <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.ID} className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
              {item.PhotoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.PhotoURL} alt={item.Title} className="h-56 w-full object-cover" />
              ) : (
                <div className="flex h-56 items-center justify-center bg-cream-200 text-gold-600"><Gavel className="h-10 w-10" /></div>
              )}
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-navy-800">{item.Title}</h3>
                {item.DonorName && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy-400">Donated by {item.DonorName}</p>}
                {item.Description && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-navy-600">{item.Description}</p>}
                {item.RetailValue && <p className="mt-4 text-sm font-semibold text-navy-700">Retail value: ${Number(item.RetailValue).toLocaleString()}</p>}
                <p className="mt-5 rounded-md bg-cream-100 px-4 py-3 text-center text-sm font-semibold text-navy-700">Preview only · bidding not yet open</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
