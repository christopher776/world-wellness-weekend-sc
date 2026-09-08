import type { Metadata } from "next";
import { ShoppingBag, TrendingDown } from "lucide-react";
import { MarketplaceExperience } from "@/components/marketplace-experience";
import { fetchMarketplaceItems, marketplaceAvailability } from "@/lib/marketplace";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Make It Mine Marketplace | South Carolina Wellness Weekend",
  description: "Shop limited wellness products and experiences with prices that continuously decline from full retail through the end of South Carolina Wellness Weekend.",
};

export default async function MarketplacePage() {
  let items = [];
  let availability = [];
  try {
    items = await fetchMarketplaceItems({ publishedOnly: true });
    availability = await marketplaceAvailability(items);
  } catch {
    items = []; availability = [];
  }
  return <main className="min-h-screen bg-cream-100">
    <section className="border-b border-gold-100 bg-navy-800 px-6 py-16 text-center text-cream-100"><div className="mx-auto max-w-3xl"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/50 bg-white/10"><ShoppingBag className="h-7 w-7 text-gold-300"/></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-gold-300">South Carolina Wellness Weekend</p><h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Make It Mine</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-cream-200">Limited wellness experiences, products and packages start at full retail value. Once the clock begins, the price continuously falls toward 15% of retail. The catch: someone else can make it theirs first.</p><div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-cream-200"><TrendingDown className="h-4 w-4 text-gold-300"/> The longer you wait, the less you pay · when it’s gone, it’s gone</div></div></section>
    {items.length===0?<section className="mx-auto max-w-3xl px-6 py-20 text-center"><h2 className="font-serif text-3xl font-bold text-navy-800">The first price drops are coming soon.</h2><p className="mt-3 text-navy-600">Community wellness partners are adding limited products, experiences and packages now.</p></section>:<MarketplaceExperience items={items} initialAvailability={availability}/>} 
    <section className="mx-auto max-w-4xl px-6 pb-16 text-center text-xs leading-5 text-navy-500">SC Wellness Weekend is a community event, not a charitable organization. Marketplace purchases are retail transactions and are not represented as charitable contributions or tax-deductible donations. Proceeds help offset event production costs.</section>
  </main>;
}
