import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { fetchContentRows } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/about",
    "/blog",
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

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : route === "/blog" ? 0.9 : 0.8,
  }));

  // Dynamic entries for published blog posts, teachers, and sponsors — so
  // every indexable page (not just the static routes) is discoverable by
  // search engines and AI crawlers.
  const [posts, teachers] = await Promise.all([
    fetchContentRows("posts", { publishedOnly: true }),
    fetchContentRows("teachers", { publishedOnly: true }),
  ]);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.Slug || post.ID}`,
    lastModified: post.PublishDate ? new Date(post.PublishDate) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const teacherEntries: MetadataRoute.Sitemap = teachers.map((teacher) => ({
    url: `${siteConfig.url}/teachers/${teacher.ID}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries, ...teacherEntries];
}
