import Link from "next/link";
import { Users, GraduationCap, Handshake, CalendarDays, Newspaper } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/cms-schema";
import { SignOutButton } from "@/components/admin/sign-out-button";

const icons: Record<string, typeof Users> = {
  organizers: Users,
  teachers: GraduationCap,
  sponsors: Handshake,
  schedule: CalendarDays,
  posts: Newspaper,
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Admin
          </p>
          <h1 className="font-serif text-3xl font-bold text-navy-800">Manage Site Content</h1>
          <p className="mt-2 text-sm text-navy-600">
            Add or update organizers, teachers, sponsors, schedule items, and blog posts. Changes
            go live immediately — no redeploy needed. Remember to check &ldquo;Published&rdquo;
            when an entry is ready to appear on the site.
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.values(CONTENT_TYPES).map((def) => {
          const Icon = icons[def.slug] ?? Users;
          return (
            <Link
              key={def.slug}
              href={`/admin/${def.slug}`}
              className="flex items-start gap-4 rounded-xl border border-navy-100 bg-white p-6 shadow-sm transition-colors hover:border-gold-300"
            >
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-gold-600" />
              <div>
                <p className="font-serif text-lg font-bold text-navy-800">{def.label}</p>
                <p className="mt-1 text-sm text-navy-500">Add a new {def.label.toLowerCase().replace(/s$/, "")} entry</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
