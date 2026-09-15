"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteEntryButtonProps {
  typeSlug: string;
  id: string;
  label: string;
}

/**
 * Permanently removes a published (or draft) entry. Requires an inline
 * "are you sure?" confirmation step before the request fires, since this
 * is irreversible — there's no undo once the row is deleted from the
 * underlying Google Sheet.
 */
export function DeleteEntryButton({ typeSlug, id, label }: DeleteEntryButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "confirm" | "deleting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleDelete() {
    setStatus("deleting");
    setError("");
    try {
      const res = await fetch(`/api/admin/content/${typeSlug}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Delete failed.");
      }
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  if (status === "confirm" || status === "deleting") {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-xs text-red-600 sm:inline">Delete &ldquo;{label}&rdquo;?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={status === "deleting"}
          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-red-700 disabled:opacity-60"
        >
          {status === "deleting" && <Loader2 className="h-3 w-3 animate-spin" />}
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          disabled={status === "deleting"}
          className="text-xs font-semibold uppercase tracking-wide text-navy-400 hover:text-navy-600 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setStatus("confirm")}
        className="inline-flex items-center gap-1.5 rounded-md border border-red-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-red-600 hover:border-red-300 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
      {status === "error" && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  );
}
