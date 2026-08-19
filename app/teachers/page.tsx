import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { fetchContentRows } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";
import { SocialLinks } from "@/components/social-links";

const description =
  "Meet the inspiring wellness professionals bringing South Carolina Wellness Weekend to life — instructors, educators, facilitators, panelists, and presenters.";

export const metadata: Metadata = {
  title: "Meet Our Teachers",
  description,
  alternates: { canonical: "/teachers" },
  openGraph: {
    title: `Meet Our Teachers | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/teachers`,
  },
};

export const revalidate = 60;

export default async function TeachersPage() {
  const teachers = await fetchContentRows("teachers", { publishedOnly: true });

  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Meet Our Teachers
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            The Wellness Professionals of the Weekend
          </h1>
          <p className="mt-4 text-navy-600">
            Meet the inspiring wellness professionals bringing South Carolina Wellness Weekend to
            life.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        {teachers.length === 0 ? (
          <p className="text-center text-sm text-navy-400">
            Teacher profiles are being added — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((t) => (
              <div
                key={t.ID}
                className="flex flex-col items-center rounded-xl border border-navy-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <Link href={`/teachers/${t.ID}`} className="flex flex-col items-center">
                  {t.HeadshotURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.HeadshotURL}
                      alt={t.FullName}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream-200 text-gold-700">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                  )}
                  <p className="mt-4 font-serif text-lg font-bold text-navy-800">{t.FullName}</p>
                  <p className="text-xs uppercase tracking-wide text-gold-700">{t.Title}</p>
                  {t.BusinessName && <p className="text-xs text-navy-400">{t.BusinessName}</p>}
                  {t.ClassTitle && (
                    <p className="mt-3 rounded-full bg-cream-200 px-3 py-1 text-xs text-navy-600">
                      {t.ClassTitle}
                    </p>
                  )}
                </Link>
                <SocialLinks
                  variant="icons"
                  className="mt-4 justify-center"
                  website={t.Website}
                  instagram={t.Instagram}
                  facebook={t.Facebook}
                  linkedin={t.LinkedIn}
                  otherLink={t.OtherLinks}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
