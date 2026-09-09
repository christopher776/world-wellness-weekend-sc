import Link from "next/link";
import { ArrowLeft, ShoppingBag, Plus } from "lucide-react";
import { MarketplaceForm } from "@/components/admin/marketplace-form";
import { fetchMarketplaceItems, type MarketplaceItem } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function MarketplaceAdminPage() {
  let items: MarketplaceItem[] = [];
  try { items = await fetchMarketplaceItems(); } catch { items = []; }
  return <div className="mx-auto max-w-4xl px-6 py-16">
    <Link href="/admin" className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-400 hover:text-navy-600"><ArrowLeft className="h-3.5 w-3.5"/> Back to Admin</Link>
    <div className="flex items-start gap-3"><ShoppingBag className="mt-1 h-7 w-7 text-gold-600"/><div><h1 className="font-serif text-3xl font-bold text-navy-800">Make It Mine Marketplace</h1><p className="mt-2 text-sm text-navy-600">Add photos, descriptions and full retail prices. The system automatically reduces each live price continuously from 100% retail to 15% retail over the configured countdown.</p></div></div>
    <section className="mt-10"><p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400"><Plus className="h-3.5 w-3.5"/> Add marketplace item</p><MarketplaceForm/></section>
    <section className="mt-12"><p className="mb-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Existing listings ({items.length})</p>{items.length===0?<div className="rounded-xl border border-dashed border-navy-200 bg-white p-8 text-sm text-navy-500">No marketplace listings yet. Add the first item above.</div>:<div className="space-y-8">{items.map((item)=><div key={item.ID}><div className="mb-2"><p className="font-serif text-lg font-bold text-navy-800">{item.Title}</p><p className="text-xs text-navy-500">{item.Published==="TRUE"?"Published":"Draft"} · Retail ${Number(item.RetailValue||0).toFixed(2)} · Floor ${(Number(item.RetailValue||0)*0.15).toFixed(2)}</p></div><MarketplaceForm initialItem={item}/></div>)}</div>}</section>
  </div>;
}
