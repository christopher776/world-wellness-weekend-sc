import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/teachers",
    "/sponsors",
    "/schedule",
    "/vip-tickets",
    "/sponsorship",
    "/rentals",
    "/hotel-travel",
    "/teach-a-class",
    "/association",
    "/rsvp",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
