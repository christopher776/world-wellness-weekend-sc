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
    sameAs: [],
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
