import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { fetchContentRows, truthy } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

async function getTeacher(id: string) {
  const teachers = await fetchContentRows("teachers", { publishedOnly: true });
  return teachers.find((t) => t.ID === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const teacher = await getTeacher(id);
  if (!teacher) return { title: "Teacher" };
  return {
    title: teacher.FullName,
    description: `${teacher.FullName} — ${teacher.Title || "Wellness Professional"} at ${siteConfig.shortName}.`,
    alternates: { canonical: `/teachers/${id}` },
  };
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = await getTeacher(id);
  if (!teacher) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/teachers"
        className="mb-8 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-400 hover:text-navy-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All Teachers
      </Link>

      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">
        {teacher.HeadshotURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={teacher.HeadshotURL}
            alt={teacher.FullName}
            className="h-32 w-32 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-cream-200 text-gold-700">
            <GraduationCap className="h-10 w-10" />
          </div>
        )}
        <div className="mt-4 sm:mt-0">
          <h1 className="font-serif text-3xl font-bold text-navy-800">{teacher.FullName}</h1>
          <p className="mt-1 text-sm uppercase tracking-wide text-gold-700">{teacher.Title}</p>
          {teacher.Credentials && <p className="text-sm text-navy-500">{teacher.Credentials}</p>}
          {teacher.BusinessName && (
            <p className="mt-1 text-sm font-semibold text-navy-700">{teacher.BusinessName}</p>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-gold-700 sm:justify-start">
            {teacher.Website && <a href={teacher.Website} target="_blank" rel="noreferrer" className="underline">Website</a>}
            {teacher.Instagram && <a href={`https://instagram.com/${teacher.Instagram.replace("@", "")}`} target="_blank" rel="noreferrer" className="underline">Instagram</a>}
            {teacher.Facebook && <a href={teacher.Facebook} target="_blank" rel="noreferrer" className="underline">Facebook</a>}
            {teacher.LinkedIn && <a href={teacher.LinkedIn} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>}
          </div>
        </div>
      </div>

      {teacher.Bio && <p className="mt-8 text-sm leading-relaxed text-navy-600">{teacher.Bio}</p>}

      {teacher.WellnessQuote && (
        <p className="mt-6 rounded-md bg-cream-200 px-5 py-4 font-serif text-base italic text-navy-700">
          &ldquo;{teacher.WellnessQuote}&rdquo;
        </p>
      )}

      {teacher.SimpleTip && (
        <p className="mt-4 text-sm text-navy-500">
          <span className="font-semibold text-navy-700">One simple thing everyone can do: </span>
          {teacher.SimpleTip}
        </p>
      )}

      {teacher.ClassTitle && (
        <div className="mt-10 rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
            Their Class / Session
          </p>
          <p className="mt-1 font-serif text-xl font-bold text-navy-800">{teacher.ClassTitle}</p>
          {teacher.ClassDescriptionFull && (
            <p className="mt-3 text-sm text-navy-600">{teacher.ClassDescriptionFull}</p>
          )}
          <p className="mt-3 text-xs text-navy-400">
            {teacher.ClassDate} {teacher.StartTime && `· ${teacher.StartTime}`}
            {teacher.EndTime && `–${teacher.EndTime}`} {teacher.Location && `· ${teacher.Location}`}
          </p>
          {(truthy(teacher.Complimentary) || truthy(teacher.DonationBased) || truthy(teacher.TicketRequired) || truthy(teacher.VipOnly)) && (
            <p className="mt-2 flex flex-wrap gap-2">
              {truthy(teacher.Complimentary) && <span className="rounded-full bg-cream-200 px-3 py-1 text-xs text-navy-600">Complimentary</span>}
              {truthy(teacher.DonationBased) && <span className="rounded-full bg-cream-200 px-3 py-1 text-xs text-navy-600">Donation Based</span>}
              {truthy(teacher.TicketRequired) && <span className="rounded-full bg-cream-200 px-3 py-1 text-xs text-navy-600">Ticket Required</span>}
              {truthy(teacher.VipOnly) && <span className="rounded-full bg-gold-50 px-3 py-1 text-xs text-gold-700">VIP Only</span>}
            </p>
          )}
          <Link
            href={`/schedule#${teacher.ID}`}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-700"
          >
            View My Class <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
