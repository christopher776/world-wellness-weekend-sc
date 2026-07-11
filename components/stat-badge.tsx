import { LucideIcon } from "lucide-react";

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function StatBadge({ icon: Icon, label, value }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gold-100 bg-white/70 px-5 py-4">
      <Icon className="h-5 w-5 text-gold-700" />
      <div>
        <p className="text-xs uppercase tracking-wide text-navy-400">{label}</p>
        <p className="font-serif text-sm font-bold text-navy-800">{value}</p>
      </div>
    </div>
  );
}
