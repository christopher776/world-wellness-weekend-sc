import Link from "next/link";
import { Pencil, CircleCheck, CircleDashed } from "lucide-react";
import type { ContentTypeDef } from "@/lib/cms-schema";
import type { CmsRow } from "@/lib/cms";
import { truthy } from "@/lib/cms";

export function EntriesList({ def, rows }: { def: ContentTypeDef; rows: CmsRow[] }) {
  const titleField = def.fields[0]?.name ?? "ID";

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-navy-100 bg-white px-5 py-6 text-center text-sm text-navy-400">
        No {def.label.toLowerCase()} yet. Add the first one below.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {rows.map((row) => {
        const published = truthy(row.Published);
        const title = row[titleField] || row.ID || "Untitled";
        return (
          <li
            key={row.ID}
            className="flex items-center justify-between gap-4 rounded-lg border border-navy-100 bg-white px-5 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              {published ? (
                <CircleCheck className="h-4 w-4 shrink-0 text-green-600" aria-label="Published" />
              ) : (
                <CircleDashed className="h-4 w-4 shrink-0 text-navy-300" aria-label="Draft" />
              )}
              <span className="truncate text-sm font-medium text-navy-800">{title}</span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  published ? "bg-green-50 text-green-700" : "bg-navy-50 text-navy-400"
                }`}
              >
                {published ? "Published" : "Draft"}
              </span>
            </div>
            <Link
              href={`/admin/${def.slug}/${encodeURIComponent(row.ID)}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-navy-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy-600 hover:border-gold-300 hover:text-gold-700"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
