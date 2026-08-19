import { siteConfig } from "@/lib/site-config";

export function JsonLd() {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: siteConfig.event.name,
    startDate: siteConfig.event.startDate,
    endDate: siteConfig.event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: siteConfig.event.venueName,
      address: {
        "@type": "PostalAddress",
        ...siteConfig.event.address,
      },
    },
    image: [siteConfig.ogImage],
    description: siteConfig.description,
    organizer: {
      "@type": "Organization",
      name: "South Carolina Spa & Wellness Association",
      url: siteConfig.url,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "200",
      highPrice: "8000",
      url: `${siteConfig.url}/sponsorship`,
      availability: "https://schema.org/InStock",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "South Carolina Spa & Wellness Association",
    url: siteConfig.url,
    logo: siteConfig.logoImage,
    sameAs: siteConfig.socialProfiles,
    // Local SEO signal: ties the organization to the Charleston, SC event
    // location it actually operates in.
    address: {
      "@type": "PostalAddress",
      ...siteConfig.event.address,
    },
    areaServed: {
      "@type": "State",
      name: "South Carolina",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contactEmail,
      contactType: "customer service",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}

/**
 * Renders a schema.org FAQPage block for any page with a Q&A list —
 * powers Google's FAQ rich results and gives AI answer engines
 * (ChatGPT, Perplexity, Google AI Overviews) clean, directly-quotable
 * question/answer pairs.
 */
export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
