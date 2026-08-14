import { NextResponse } from "next/server";
import { CONTENT_TYPES, type ContentTypeSlug } from "@/lib/cms-schema";
import { fetchContentRows, upsertRow, newId } from "@/lib/cms";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const def = CONTENT_TYPES[type as ContentTypeSlug];
  if (!def) {
    return NextResponse.json({ ok: false, error: "Unknown content type." }, { status: 404 });
  }
  const rows = await fetchContentRows(type as ContentTypeSlug, { revalidate: 0 });
  return NextResponse.json({ ok: true, rows });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const def = CONTENT_TYPES[type as ContentTypeSlug];
  if (!def) {
    return NextResponse.json({ ok: false, error: "Unknown content type." }, { status: 404 });
  }

  let body: { id?: string; fields?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const fields = body.fields ?? {};
  for (const field of def.fields) {
    if (field.required && !fields[field.name]?.trim()) {
      return NextResponse.json(
        { ok: false, error: `"${field.label}" is required.` },
        { status: 400 }
      );
    }
  }

  const id = body.id?.trim() || newId(def.idPrefix);
  const row = { ID: id, ...fields };

  const result = await upsertRow(def.sheetName, row);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id });
}
