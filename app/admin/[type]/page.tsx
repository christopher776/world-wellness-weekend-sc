import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CONTENT_TYPES, type ContentTypeSlug } from "@/lib/cms-schema";
import { ContentForm } from "@/components/admin/content-form";

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

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-400 hover:text-navy-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
      </Link>
      <h1 className="font-serif text-3xl font-bold text-navy-800">Add {def.label.replace(/s$/, "")}</h1>
      <p className="mt-2 text-sm text-navy-600">
        Fill out the fields below. Existing entries can be edited by asking Chris to update their
        row directly in the {def.sheetName} tab of the shared spreadsheet.
      </p>
      <div className="mt-8">
        <ContentForm def={def} />
      </div>
    </div>
  );
}
