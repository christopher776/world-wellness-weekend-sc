/**
 * lucide-react doesn't ship a TikTok glyph, so this is a small hand-drawn
 * SVG icon matching the same 24x24 viewBox / stroke conventions as the
 * lucide icons used alongside it (Instagram, Facebook, Linkedin), so it
 * sits visually consistent in icon rows.
 */
export function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 2h-3.2v13.4a2.9 2.9 0 1 1-2.05-2.77V9.5a6 6 0 1 0 5.25 5.95V8.77a7.15 7.15 0 0 0 4.2 1.35V6.9a4.15 4.15 0 0 1-4.2-4.15V2Z" />
    </svg>
  );
}
