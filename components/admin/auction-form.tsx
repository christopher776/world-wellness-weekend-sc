"use client";

import { FormEvent, useState } from "react";
import { CheckCircle, Loader2, UploadCloud } from "lucide-react";
import type { AuctionItem } from "@/lib/auction";

const emptyItem: AuctionItem = {
  ID: "",
  Title: "",
  PhotoURL: "",
  Description: "",
  DonorName: "",
  RetailValue: "",
  StartingBid: "25",
  BidIncrement: "5",
  OpensAt: "",
  ClosesAt: "2026-09-19T19:00",
  PickupDetails: "",
  Terms: "",
  Featured: "FALSE",
  Published: "FALSE",
};

function inputClass() {
  return "w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600";
}

export function AuctionForm({ initialItem }: { initialItem?: AuctionItem }) {
  const [values, setValues] = useState<AuctionItem>(initialItem || emptyItem);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function set(name: keyof AuctionItem, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data?.error || "Upload failed.");
      set("PhotoURL", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/admin/auction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: values.ID || undefined, fields: values }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data?.error || "Save failed.");
      setValues((previous) => ({ ...previous, ID: data.id }));
      setStatus("saved");
      if (!initialItem) {
        setTimeout(() => {
          setValues(emptyItem);
          setStatus("idle");
        }, 1200);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Save failed.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Item title *</label>
        <input required value={values.Title} onChange={(e) => set("Title", e.target.value)} className={inputClass()} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Photo</label>
        <div className="flex items-center gap-3">
          {values.PhotoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={values.PhotoURL} alt="Auction item" className="h-20 w-20 rounded-md object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-navy-200 text-navy-300">
              <UploadCloud className="h-5 w-5" />
            </div>
          )}
          <label className="cursor-pointer rounded-md border border-navy-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-navy-600 hover:bg-navy-50">
            {uploading ? "Uploading..." : values.PhotoURL ? "Replace photo" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }} />
          </label>
        </div>
        <input value={values.PhotoURL} onChange={(e) => set("PhotoURL", e.target.value)} placeholder="or paste image URL" className={`${inputClass()} mt-2`} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Description</label>
        <textarea rows={5} value={values.Description} onChange={(e) => set("Description", e.target.value)} className={inputClass()} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Donated by</label>
          <input value={values.DonorName} onChange={(e) => set("DonorName", e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Retail value</label>
          <input type="number" min="0" step="0.01" value={values.RetailValue} onChange={(e) => set("RetailValue", e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Starting bid *</label>
          <input required type="number" min="0" step="0.01" value={values.StartingBid} onChange={(e) => set("StartingBid", e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Bid increment *</label>
          <input required type="number" min="1" step="0.01" value={values.BidIncrement} onChange={(e) => set("BidIncrement", e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Bidding opens</label>
          <input type="datetime-local" value={values.OpensAt} onChange={(e) => set("OpensAt", e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Bidding closes *</label>
          <input required type="datetime-local" value={values.ClosesAt} onChange={(e) => set("ClosesAt", e.target.value)} className={inputClass()} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Pickup / fulfillment details</label>
        <textarea rows={3} value={values.PickupDetails} onChange={(e) => set("PickupDetails", e.target.value)} className={inputClass()} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">Item terms</label>
        <textarea rows={3} value={values.Terms} onChange={(e) => set("Terms", e.target.value)} className={inputClass()} />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-navy-700">
          <input type="checkbox" checked={values.Featured === "TRUE"} onChange={(e) => set("Featured", e.target.checked ? "TRUE" : "FALSE")} /> Featured item
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-700">
          <input type="checkbox" checked={values.Published === "TRUE"} onChange={(e) => set("Published", e.target.checked ? "TRUE" : "FALSE")} /> Published / visible
        </label>
      </div>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {status === "saved" && <p className="flex items-center gap-2 text-sm font-semibold text-green-700"><CheckCircle className="h-4 w-4" /> Saved</p>}

      <button type="submit" disabled={status === "saving" || uploading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-800 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream-100 hover:bg-navy-600 disabled:opacity-60">
        {status === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
        {values.ID ? "Update auction item" : "Add auction item"}
      </button>
    </form>
  );
}
