import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { fetchContentRows, type CmsRow } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";
import { formatEventDate, formatEventTimeRange } from "@/lib/format-datetime";

const description =
  "The full South Carolina Wellness Weekend schedule — classes, panels, and activations for Friday, September 18 and Saturday, September 19, 2026 in Charleston, SC (all times Eastern).";

export const metadata: Metadata = {
  title: "Schedule of Events",
  description,
  alternates: { canonical: "/schedule" },
  openGraph: {
    title: `Schedule of Events | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/schedule`,
  },
};

export const revalidate = 60;

function timeToMinutes(t: string): number {
  const match = t?.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && hours !== 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export default async function SchedulePage() {
  const [items, teachers, sponsors] = await Promise.all([
    fetchContentRows("schedule", { publishedOnly: true }),
    fetchContentRows("teachers", { publishedOnly: true }),
    fetchContentRows("sponsors", { publishedOnly: true }),
  ]);

  const teacherById = new Map(teachers.map((t) => [t.ID, t]));
  const sponsorById = new Map(sponsors.map((s) => [s.ID, s]));

  const byDate = new Map<string, CmsRow[]>();
  for (const item of items) {
    const date = item.Date || "TBD";
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push(item);
  }
  for (const dayItems of byDate.values()) {
    dayItems.sort((a, b) => timeToMinutes(a.StartTime) - timeToMinutes(b.StartTime));
  }
  const sortedDates = [...byDate.keys()].sort();

  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            Schedule of Events
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            Plan Your Weekend
          </h1>
          <p className="mt-4 text-navy-600">
            Everything happening at South Carolina Wellness Weekend, organized by day and time.
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
            All times are Eastern Time (Charleston, SC)
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        {sortedDates.length === 0 ? (
          <p className="text-center text-sm text-navy-400">
            The schedule is being finalized — check back soon.
          </p>
        ) : (
          <div className="space-y-14">
            {sortedDates.map((date) => (
              <div key={date}>
                <h2 className="mb-6 font-serif text-2xl font-bold uppercase tracking-wide text-navy-800">
                  {formatEventDate(date) || date}
                </h2>
                <div className="space-y-4">
                  {byDate.get(date)!.map((item) => {
                    const teacher = item.InstructorTeacherID
                      ? teacherById.get(item.InstructorTeacherID)
                      : undefined;
                    const sponsor = item.SponsorID ? sponsorById.get(item.SponsorID) : undefined;
                    return (
                      <div
                        key={item.ID}
                        id={item.ID}
                        className="scroll-mt-24 rounded-lg border border-navy-100 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-serif text-lg font-bold text-navy-800">{item.Title}</p>
                          {item.Category && (
                            <span className="w-fit rounded-full bg-cream-200 px-3 py-1 text-xs uppercase tracking-wide text-navy-500">
                              {item.Category}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-navy-500">
                          {(item.StartTime || item.EndTime) && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatEventTimeRange(item.StartTime, item.EndTime)}
                            </span>
                          )}
                          {item.Location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {item.Location}
                            </span>
                          )}
                        </div>
                        {item.ShortDescription && (
                          <p className="mt-3 text-sm text-navy-600">{item.ShortDescription}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-4 text-xs">
                          {teacher && (
                            <Link href={`/teachers/${teacher.ID}`} className="font-semibold text-gold-700 underline hover:text-gold-600">
                              {teacher.FullName}
                            </Link>
                          )}
                          {sponsor && (
                            <Link href="/sponsors" className="font-semibold text-gold-700 underline hover:text-gold-600">
                              Presented by {sponsor.CompanyName}
                            </Link>
                          )}
                          {item.RegistrationLink && (
                            <a
                              href={item.RegistrationLink}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-navy-700 underline hover:text-navy-500"
                            >
                              Register
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
