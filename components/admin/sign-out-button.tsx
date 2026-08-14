"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-400 hover:text-navy-600"
    >
      <LogOut className="h-3.5 w-3.5" /> Sign out
    </button>
  );
}
