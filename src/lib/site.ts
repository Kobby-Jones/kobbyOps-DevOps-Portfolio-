const productionOrigin = "https://www.cobbinaemmanuel.tech";

function normalizePortfolioUrl(url: URL) {
  if (url.hostname === "cobbinaemmanuel.tech" || url.hostname === "www.cobbinaemmanuel.tech") {
    url.protocol = "https:";
    url.host = "www.cobbinaemmanuel.tech";
    url.port = "";
  }
  return url;
}

export const siteConfig = {
  name: "Cobbina Emmanuel",
  alternateName: "Kobby Jones",
  brand: "KobbyOps",
  title: "Cobbina Emmanuel | Software & Cloud Engineer",
  description:
    "Cobbina Emmanuel is a Software and Cloud Engineer in Ghana building secure applications, cloud platforms, APIs, CI/CD systems, and production-ready infrastructure.",
  url: normalizePortfolioUrl(new URL(process.env.NEXT_PUBLIC_SITE_URL || productionOrigin)).origin,
  email: "cobbina1.emmanuel@gmail.com",
  phone: "+233598738535",
  location: "Accra, Ghana",
  github: "https://github.com/Kobby-Jones",
  linkedin: "https://www.linkedin.com/in/cobbina-emmanuel",
  resume: "/resume/Cobbina-Emmanuel-CV.pdf",
  locale: "en_GH",
} as const;

export const absoluteUrl = (path = "/") =>
  new URL(path, siteConfig.url).toString();

export function articleCanonicalUrl(article: { type: string; slug: string; canonicalUrl?: string }) {
  const path = `/${article.type === "blog" ? "blog" : "insights"}/${article.slug}`;
  if (article.canonicalUrl) {
    try {
      const url = new URL(article.canonicalUrl, siteConfig.url);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return normalizePortfolioUrl(url).href;
      }
    } catch {
      // Older content may contain an invalid canonical override.
    }
  }
  return absoluteUrl(path);
}
