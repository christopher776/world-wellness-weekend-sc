import type { Metadata } from "next";
import { Heart, Users } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { fetchContentRows } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";
import { SocialLinks } from "@/components/social-links";

const description =
  "Who we are, why we're bringing South Carolina Wellness Weekend to Charleston, and the organizers behind the inaugural event.";

export const metadata: Metadata = {
  title: "About Us | Event Organizers",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About Us | Event Organizers | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/about`,
  },
};

export const revalidate = 60;

export default async function AboutPage() {
  const organizers = await fetchContentRows("organizers", { publishedOnly: true });

  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            About Us
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            Event Organizers
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-navy-600">
        <p>
          South Carolina Wellness Weekend is a statewide celebration of movement, mindfulness,
          community, and holistic wellbeing. As part of the global World Wellness Weekend
          movement, our mission is to inspire people to live healthier, happier lives through
          accessible, inclusive, and uplifting wellness experiences. This inaugural event brings
          together leaders across spa, fitness, beauty, hospitality, medical wellness, and
          lifestyle to create meaningful activations throughout Charleston and the Lowcountry.
        </p>
        <div>
          <h2 className="font-serif text-xl font-bold text-navy-800">
            Why South Carolina?
          </h2>
          <p className="mt-3">
            South Carolina is home to a vibrant, growing wellness community — from luxury spas and
            boutique studios to medical-wellness innovators and lifestyle brands. By bringing
            World Wellness Weekend to our state, we aim to unite these voices, elevate local
            wellness culture, and create a statewide platform that encourages people to explore
            wellbeing in ways that feel joyful, approachable, and sustainable.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-navy-800">
            Why Charleston?
          </h2>
          <p className="mt-3">
            Charleston is a city where history, hospitality, and culture meet — making it the
            perfect backdrop for a wellness celebration rooted in community and connection. Its
            walkable downtown, thriving spa and hospitality scene, and reputation as a destination
            for travelers seeking restorative experiences make Charleston an ideal home for the
            inaugural South Carolina Wellness Fair.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-navy-800">
            Our Mission
          </h2>
          <p className="mt-3">
            Our mission is to make wellness approachable, inclusive, educational, inspiring, and
            accessible for every member of the community. Wellness Weekend South Carolina exists
            to unite wellness professionals across the state, provide free and low-cost wellness
            experiences to the community, highlight local businesses and practitioners, inspire
            healthier living through movement, mindfulness, and connection, and celebrate the
            global movement of wellbeing.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-navy-800">
            Our Host Location
          </h2>
          <p className="mt-3">
            The inaugural South Carolina Wellness Fair is co-hosted by the Francis Marion Hotel and
            The Spa of Charleston, two iconic Charleston institutions known for their commitment to
            hospitality, luxury, and guest wellbeing. The Francis Marion Hotel provides a historic,
            elegant setting for workshops, panels, and community activations, while The Spa of
            Charleston brings a boutique, ritual-driven approach to wellness that elevates the
            guest experience.
          </p>
        </div>
        <div className="rounded-lg border border-gold-100 bg-cream-200 p-6">
          <p className="flex items-start gap-2 text-sm">
            <Heart className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
            World Wellness Weekend is celebrated in more than 150 countries, connecting millions of
            people through wellness experiences, community events, and global activations. South
            Carolina is proud to join this international movement and contribute to a worldwide
            celebration of wellbeing.
          </p>
        </div>
      </section>

      <section className="bg-cream-200 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading eyebrow="Meet the Organizers" title="The Team Behind the Weekend" />
          {organizers.length === 0 ? (
            <p className="text-center text-sm text-navy-400">
              Organizer profiles are being added — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {organizers.map((org) => (
                <div key={org.ID} className="rounded-xl border border-navy-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-4">
                    {org.HeadshotURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={org.HeadshotURL}
                        alt={org.FullName}
                        className="h-[72px] w-[72px] rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-cream-200 text-gold-700">
                        <Users className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-serif text-lg font-bold text-navy-800">{org.FullName}</p>
                      <p className="text-xs uppercase tracking-wide text-gold-700">{org.Title}</p>
                      <p className="text-xs text-navy-400">{org.Organization}</p>
                    </div>
                  </div>
                  {org.Bio && <p className="mt-5 text-sm text-navy-600">{org.Bio}</p>}
                  {org.WellnessQuote && (
                    <p className="mt-5 rounded-md bg-cream-200 px-4 py-3 font-serif text-sm italic text-navy-700">
                      &ldquo;{org.WellnessQuote}&rdquo;
                    </p>
                  )}
                  {org.SimpleTip && (
                    <p className="mt-3 text-xs text-navy-500">
                      <span className="font-semibold text-navy-700">One simple thing: </span>
                      {org.SimpleTip}
                    </p>
                  )}
                  <SocialLinks
                    className="mt-4"
                    website={org.Website}
                    instagram={org.Instagram}
                    linkedin={org.LinkedIn}
                    otherLink={org.OtherSocial}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
