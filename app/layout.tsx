import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/lib/site-config";

const iconMarkUrl =
  "https://galaxy-prod.tlcdn.com/gen/user_33t8y88T1htQ2Ohh0A0DVFfvIXu/b2d1deb6-0ac0-4076-955b-60cbbfb08e20.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | September 18–19, 2026 | Charleston, SC`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "South Carolina Spa & Wellness Association" }],
  category: "Events",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: iconMarkUrl, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: iconMarkUrl, sizes: "512x512" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | September 18–19, 2026 | Charleston, SC`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1536,
        height: 1024,
        alt: "World Wellness Weekend, South Carolina logo on navy background",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | September 18–19, 2026`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  themeColor: "#0B2545",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream-100 font-sans antialiased">
        <JsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-cream-100"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
