import type { Metadata } from "next";
import { Gavel, HeartHandshake } from "lucide-react";
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
    "Bid on wellness experiences, products and packages supporting South Carolina Wellness Weekend and the statewide wellness community.",
};

export default async function AuctionPage() {
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
            Bid on donated wellness experiences, products and packages while supporting a healthier, more connected South Carolina wellness community.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-cream-200">
            <HeartHandshake className="h-4 w-4 text-gold-300" /> Register once · bid online · winners contacted after closing
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl font-bold text-navy-800">Auction items are coming soon.</h2>
          <p className="mt-3 text-navy-600">Check back for wellness experiences, products and packages from participating partners.</p>
        </section>
      ) : (
        <div className="pt-10">
          <AuctionExperience items={items} initialStatus={initialStatus} />
        </div>
      )}
    </main>
  );
}
