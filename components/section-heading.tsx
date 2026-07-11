interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 ${align === "center" ? "text-center mx-auto max-w-2xl" : "text-left"}`}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-700">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-navy-400 leading-relaxed">{subtitle}</p>
      )}
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="h-px w-10 bg-gold-600" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold-600" />
        <span className="h-px w-10 bg-gold-600" />
      </div>
    </div>
  );
}
