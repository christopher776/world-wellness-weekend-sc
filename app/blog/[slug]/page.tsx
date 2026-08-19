import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { fetchContentRows } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";
import { formatEventDate } from "@/lib/format-datetime";

export const revalidate = 60;

async function getPost(slug: string) {
  const posts = await fetchContentRows("posts", { publishedOnly: true });
  return posts.find((p) => p.Slug === slug || p.ID === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Blog Post" };

  const title = post.MetaTitle || post.Title;
  const description = post.MetaDescription || post.Excerpt || siteConfig.description;
  const image = post.FeaturedImageURL || siteConfig.ogImage;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.Slug || post.ID}` },
    openGraph: {
      type: "article",
      title: `${title} | ${siteConfig.shortName}`,
      description,
      url: `${siteConfig.url}/blog/${post.Slug || post.ID}`,
      images: [{ url: image }],
      publishedTime: post.PublishDate || undefined,
      authors: post.Author ? [post.Author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const tags = (post.Tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const paragraphs = (post.Content || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const postUrl = `${siteConfig.url}/blog/${post.Slug || post.ID}`;
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.Title,
    description: post.MetaDescription || post.Excerpt,
    image: post.FeaturedImageURL ? [post.FeaturedImageURL] : [siteConfig.ogImage],
    datePublished: post.PublishDate || undefined,
    dateModified: post.PublishDate || undefined,
    author: post.Author
      ? { "@type": "Person", name: post.Author }
      : { "@type": "Organization", name: "South Carolina Spa & Wellness Association" },
    publisher: {
      "@type": "Organization",
      name: "South Carolina Spa & Wellness Association",
      logo: { "@type": "ImageObject", url: siteConfig.logoImage },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    url: postUrl,
    keywords: tags.join(", ") || undefined,
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-400 hover:text-navy-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All Posts
      </Link>

      {post.Category && (
        <span className="mb-3 inline-block w-fit rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
          {post.Category}
        </span>
      )}

      <h1 className="font-serif text-3xl font-bold text-navy-800 md:text-4xl">{post.Title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-navy-400">
        {post.PublishDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatEventDate(post.PublishDate)}
          </span>
        )}
        {post.Author && (
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {post.Author}
          </span>
        )}
      </div>

      {post.FeaturedImageURL && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.FeaturedImageURL}
          alt={post.Title}
          className="mt-8 w-full rounded-xl object-cover"
        />
      )}

      <div className="prose-content mt-8 space-y-4 text-sm leading-relaxed text-navy-600">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>{post.Excerpt}</p>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-navy-400" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cream-200 px-3 py-1 text-xs text-navy-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-xl border border-gold-100 bg-cream-200 p-6 text-center">
        <p className="font-serif text-lg font-bold text-navy-800">
          Join us at South Carolina Wellness Weekend
        </p>
        <p className="mt-2 text-sm text-navy-600">
          September 18&ndash;19, 2026 in Charleston, SC.
        </p>
        <Link
          href="/rsvp"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-gold-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-700"
        >
          RSVP &amp; Get Updates
        </Link>
      </div>
    </div>
  );
}
