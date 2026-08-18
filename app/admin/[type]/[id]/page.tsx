import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { CONTENT_TYPES, type ContentTypeSlug } from "@/lib/cms-schema";
import { fetchRowById } from "@/lib/cms";
import { ContentForm } from "@/components/admin/content-form";

export const dynamic = "force-dynamic";

export default async function AdminEditEntryPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const def = CONTENT_TYPES[type as ContentTypeSlug];
  if (!def) notFound();

  const row = await fetchRowById(type as ContentTypeSlug, decodeURIComponent(id));

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href={`/admin/${def.slug}`}
        className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-400 hover:text-navy-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to {def.label}
      </Link>
      <h1 className="font-serif text-3xl font-bold text-navy-800">
        Edit {def.label.replace(/s$/, "")}
      </h1>

      {row ? (
        <>
          <p className="mt-2 text-sm text-navy-600">
            Update the fields below and save — changes go live immediately.
          </p>
          <div className="mt-8">
            <ContentForm def={def} initialValues={row} id={row.ID} />
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-700">
            This entry couldn&apos;t be found — it may have been removed. Double-check the link, or
            go back and pick it from the list.
          </p>
          <Link
            href={`/admin/${def.slug}`}
            className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
          >
            Back to {def.label}
          </Link>
        </div>
      )}
    </div>
  );
}
