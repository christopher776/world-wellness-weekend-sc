import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { CONTENT_TYPES, type ContentTypeSlug } from "@/lib/cms-schema";
import { fetchContentRows } from "@/lib/cms";
import { ContentForm } from "@/components/admin/content-form";
import { EntriesList } from "@/components/admin/entries-list";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.keys(CONTENT_TYPES).map((type) => ({ type }));
}

export default async function AdminContentTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const def = CONTENT_TYPES[type as ContentTypeSlug];
  if (!def) notFound();

  const rows = await fetchContentRows(type as ContentTypeSlug, { revalidate: 0 });

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-400 hover:text-navy-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
      </Link>
      <h1 className="font-serif text-3xl font-bold text-navy-800">{def.label}</h1>
      <p className="mt-2 text-sm text-navy-600">
        Click &ldquo;Edit&rdquo; on any entry below to update it, or add a new one with the form
        underneath. Changes go live immediately — remember to mark an entry &ldquo;Published&rdquo;
        for it to appear on the site.
      </p>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-400">
          Existing Entries ({rows.length})
        </p>
        <EntriesList def={def} rows={rows} />
      </div>

      <div className="mt-12">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
          <Plus className="h-3.5 w-3.5" /> Add {def.label.replace(/s$/, "")}
        </p>
        <ContentForm def={def} />
      </div>
    </div>
  );
}
