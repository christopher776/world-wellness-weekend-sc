import { Globe, Instagram, Facebook, Linkedin, Link2 } from "lucide-react";

interface SocialLinksProps {
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  otherLink?: string;
  otherLabel?: string;
  /** "icons" — compact icon-only row for cards/lists. "text" — labeled links for detail pages. */
  variant?: "icons" | "text";
  className?: string;
}

function toInstagramUrl(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
}

function toUrl(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Renders whichever social links are actually filled in on the admin-managed
 * profile (organizer, teacher, or sponsor row) — nothing shows for a field
 * left blank, so this stays in sync automatically as entries are edited in
 * the admin panel.
 */
export function SocialLinks({
  website,
  instagram,
  facebook,
  linkedin,
  otherLink,
  otherLabel = "More",
  variant = "text",
  className = "",
}: SocialLinksProps) {
  const links: { key: string; href: string; label: string; Icon: typeof Globe }[] = [];

  if (website?.trim()) links.push({ key: "website", href: toUrl(website), label: "Website", Icon: Globe });
  if (instagram?.trim()) links.push({ key: "instagram", href: toInstagramUrl(instagram), label: "Instagram", Icon: Instagram });
  if (facebook?.trim()) links.push({ key: "facebook", href: toUrl(facebook), label: "Facebook", Icon: Facebook });
  if (linkedin?.trim()) links.push({ key: "linkedin", href: toUrl(linkedin), label: "LinkedIn", Icon: Linkedin });
  if (otherLink?.trim()) links.push({ key: "other", href: toUrl(otherLink), label: otherLabel, Icon: Link2 });

  if (links.length === 0) return null;

  if (variant === "icons") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {links.map(({ key, href, label, Icon }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
            className="text-navy-400 transition-colors hover:text-gold-600"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 text-xs text-gold-700 ${className}`}>
      {links.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 underline hover:text-gold-600"
        >
          <Icon className="h-3.5 w-3.5" /> {label}
        </a>
      ))}
    </div>
  );
}
