"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, AlertCircle, UploadCloud } from "lucide-react";
import type { ContentTypeDef } from "@/lib/cms-schema";

interface ContentFormProps {
  def: ContentTypeDef;
  /** When editing an existing entry, its current field values. */
  initialValues?: Record<string, string>;
  /** When editing an existing entry, its row ID. Omit to create a new entry. */
  id?: string;
}

type Values = Record<string, string>;

function ImageField({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Upload failed.");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-16 w-16 rounded-md object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-navy-100 text-navy-300">
            <UploadCloud className="h-5 w-5" />
          </div>
        )}
        <label className="cursor-pointer rounded-md border border-navy-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-navy-600 hover:bg-navy-50">
          {uploading ? "Uploading..." : value ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste an image URL"
          className="flex-1 rounded-md border border-navy-100 px-3 py-2 text-xs text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function ContentForm({ def, initialValues, id }: ContentFormProps) {
  const isEditing = Boolean(id);
  const singularLabel = def.label.replace(/s$/, "");

  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(
      def.fields.map((f) => [f.name, initialValues?.[f.name] ?? ""])
    )
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function set(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch(`/api/admin/content/${def.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { id, fields: values } : { fields: values }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Save failed.");
      setStatus("success");
      if (!isEditing) {
        setValues(Object.fromEntries(def.fields.map((f) => [f.name, ""])));
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Save failed.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gold-100 bg-white p-10 text-center">
        <CheckCircle className="h-8 w-8 text-gold-600" />
        <p className="font-serif text-xl font-bold text-navy-800">
          {isEditing ? "Updated!" : "Saved!"}
        </p>
        <p className="text-sm text-navy-600">
          This {singularLabel.toLowerCase()} is now live on the site
          {values.Published === "TRUE" ? "" : " once you mark it Published"}.
        </p>
        <div className="mt-2 flex items-center gap-4">
          <Link
            href={`/admin/${def.slug}`}
            className="text-sm font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
          >
            Back to {def.label}
          </Link>
          {!isEditing && (
            <button
              onClick={() => setStatus("idle")}
              className="text-sm font-semibold uppercase tracking-wide text-navy-600 hover:text-navy-800"
            >
              Add another
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-navy-100 bg-white p-8 shadow-sm">
      {def.fields.map((field) => {
        if (field.type === "image") {
          return (
            <ImageField
              key={field.name}
              name={field.name}
              label={field.label}
              value={values[field.name] || ""}
              onChange={(url) => set(field.name, url)}
            />
          );
        }
        if (field.type === "checkbox") {
          return (
            <label key={field.name} className="flex items-center gap-2 text-sm text-navy-700">
              <input
                type="checkbox"
                checked={values[field.name] === "TRUE"}
                onChange={(e) => set(field.name, e.target.checked ? "TRUE" : "FALSE")}
                className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-600"
              />
              {field.label}
            </label>
          );
        }
        if (field.type === "textarea") {
          return (
            <div key={field.name}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) => set(field.name, e.target.value)}
                rows={4}
                className="w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
              />
              {field.helpText && <p className="mt-1 text-xs text-navy-400">{field.helpText}</p>}
            </div>
          );
        }
        return (
          <div key={field.name}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-600">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type === "date" ? "date" : "text"}
              required={field.required}
              value={values[field.name] || ""}
              onChange={(e) => set(field.name, e.target.value)}
              className="w-full rounded-md border border-navy-100 px-4 py-2.5 text-sm text-navy-800 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
            />
            {field.helpText && <p className="mt-1 text-xs text-navy-400">{field.helpText}</p>}
          </div>
        );
      })}

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-800 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream-100 transition-colors hover:bg-navy-600 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "submitting" ? "Saving..." : isEditing ? `Update ${singularLabel}` : `Save ${singularLabel}`}
      </button>
    </form>
  );
}
