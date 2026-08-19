import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";
import { fetchContentRows, type CmsRow } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";
import { formatEventDate } from "@/lib/format-datetime";

const description =
  "Wellness tips, event news, and Charleston, SC guides from South Carolina Wellness Weekend — the annual celebration of movement, mindfulness, and community in Charleston.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/blog`,
  },
};

export const revalidate = 60;

function postDateValue(p: CmsRow): number {
  const d = new Date(p.PublishDate || "");
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export default async function BlogIndexPage() {
  const posts = await fetchContentRows("posts", { publishedOnly: true });
  const sorted = [...posts].sort((a, b) => postDateValue(b) - postDateValue(a));

  return (
    <div>
      <section className="bg-cream-200 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            The Blog
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
            Wellness Tips &amp; Charleston Guides
          </h1>
          <p className="mt-4 text-navy-600">
            Wellness tips, event news, and local Charleston, SC guides from South Carolina
            Wellness Weekend.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-navy-400">
            Our first blog posts are on the way — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <Link
                key={post.ID}
                href={`/blog/${post.Slug || post.ID}`}
                className="flex flex-col overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {post.FeaturedImageURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.FeaturedImageURL}
                    alt={post.Title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-cream-200 text-gold-700">
                    <Newspaper className="h-8 w-8" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  {post.Category && (
                    <span className="mb-2 w-fit rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
                      {post.Category}
                    </span>
                  )}
                  <p className="font-serif text-lg font-bold text-navy-800">{post.Title}</p>
                  {post.Excerpt && (
                    <p className="mt-2 flex-1 text-sm text-navy-600">{post.Excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-navy-400">
                    {post.PublishDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatEventDate(post.PublishDate)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 font-semibold text-gold-700">
                      Read More <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
