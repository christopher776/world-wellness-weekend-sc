import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import { fetchContentRows, type CmsRow } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";

const description =
  "Meet the sponsors and partners making South Carolina Wellness Weekend possible — who they are, why they're participating, and what to experience from them.";

export const metadata: Metadata = {
  title: "Sponsor Profiles",
  description,
  alternates: { canonical: "/sponsors" },
  openGraph: {
    title: `Sponsor Profiles | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/sponsors`,
  },
};

export const revalidate = 60;

const LEVEL_ORDER = ["Diamond", "Platinum", "Gold", "Founding Partner"];

function levelRank(level: string): number {
  const idx = LEVEL_ORDER.findIndex((l) => level.toLowerCase().includes(l.toLowerCase()));
  return idx === -1 ? LEVEL_ORDER.length : idx;
}

export default async function SponsorsPage() {
  const sponsors = await fetchContentRows("sponsors", { publishedOnly: true });
  const sorted = [...sponsors].sort(
    (a, b) => levelRank(a.SponsorshipLevel || "") - levelRank(b.SponsorshipLevel || "")
  );

  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Sponsor Profiles
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            The Partners Making It Possible
          </h1>
          <p className="mt-4 text-navy-600">
            Our sponsors are helping make South Carolina Wellness Weekend possible. Here&apos;s who
            they are, why they&apos;re participating, and what you can experience from them during
            the weekend.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-navy-400">
            Sponsor profiles are being added — check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {sorted.map((s: CmsRow) => (
              <div
                key={s.ID}
                className="grid grid-cols-1 gap-6 rounded-xl border border-navy-100 bg-white p-8 shadow-sm sm:grid-cols-[160px_1fr]"
              >
                <div className="flex items-center justify-center">
                  {s.LogoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.LogoURL} alt={s.CompanyName} className="max-h-24 w-full object-contain" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream-200 text-gold-700">
                      <Handshake className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div>
                  {s.SponsorshipLevel && (
                    <span className="mb-2 inline-block rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
                      {s.SponsorshipLevel} Sponsor
                    </span>
                  )}
                  <p className="font-serif text-xl font-bold text-navy-800">{s.CompanyName}</p>
                  {s.Description && <p className="mt-2 text-sm text-navy-600">{s.Description}</p>}
                  {s.Activities && (
                    <p className="mt-3 text-sm text-navy-500">
                      <span className="font-semibold text-navy-700">During the weekend: </span>
                      {s.Activities}
                    </p>
                  )}
                  {s.WhySupport && (
                    <p className="mt-3 rounded-md bg-cream-200 px-4 py-3 text-sm italic text-navy-700">
                      &ldquo;{s.WhySupport}&rdquo;
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {s.Website && (
                      <a
                        href={s.Website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
                      >
                        Visit Website <ArrowRight className="h-3 w-3" />
                      </a>
                    )}
                    {s.LinkedScheduleItemID && (
                      <Link
                        href={`/schedule#${s.LinkedScheduleItemID}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
                      >
                        See Their Experience <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 rounded-xl bg-navy-800 px-8 py-10 text-center text-cream-100">
          <p className="font-serif text-2xl font-bold">Interested in Becoming a Sponsor?</p>
          <Link
            href="/sponsorship"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-gold-600 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-700"
          >
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
