import type { Metadata, Viewport } from "next";
import JsonLd from "@/components/site/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Cobbina Emmanuel",
  },
  description: siteConfig.description,
  applicationName: siteConfig.brand,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  keywords: [
    "Cobbina Emmanuel",
    "Kobby Jones",
    "Software Engineer Ghana",
    "Cloud Engineer Ghana",
    "DevOps Engineer Ghana",
    "AWS Engineer Ghana",
    "Platform Engineer",
    "Backend Developer Ghana",
    "Cloud Consulting Ghana",
    "DevOps Consulting",
    "AWS Consulting",
    "Software Architecture",
    "Production Readiness",
    "Docker",
    "Kubernetes",
    "CI/CD",
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: `${siteConfig.name} · ${siteConfig.brand}`,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{
      url: absoluteUrl("/opengraph-image"),
      width: 1200,
      height: 630,
      alt: `${siteConfig.name}, Software and Cloud Engineer`,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl("/opengraph-image")],
  },
  icons: { icon: "/favicon.ico" },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: siteConfig.name,
    alternateName: [siteConfig.alternateName, siteConfig.brand],
    url: siteConfig.url,
    image: absoluteUrl("/images/profile.jpeg"),
    jobTitle: "Software & Cloud Engineer",
    description: siteConfig.description,
    email: `mailto:${siteConfig.email}`,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Energy and Natural Resources",
    },
    sameAs: [siteConfig.github, siteConfig.linkedin],
    knowsAbout: [
      "Cloud engineering",
      "Software engineering",
      "AWS",
      "DevOps",
      "Platform engineering",
      "Backend development",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteConfig.url,
    name: `${siteConfig.name} Portfolio`,
    alternateName: siteConfig.brand,
    description: siteConfig.description,
    inLanguage: "en-GH",
    publisher: { "@id": absoluteUrl("/#person") },
  };

  return (
    <html lang="en-GH" className="scroll-smooth">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <JsonLd data={[personSchema, websiteSchema]} />
        {children}
      </body>
    </html>
  );
}
