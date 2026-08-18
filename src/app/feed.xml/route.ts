import { getArticles, getResources, getServices } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] || character);

type FeedItem = {
  title: string;
  url: string;
  description: string;
  publishedAt?: string;
  categories: string[];
};

export async function GET() {
  const [articles, services, resources] = await Promise.all([
    getArticles(),
    getServices(),
    getResources(),
  ]);

  const articleItems: FeedItem[] = articles.map((article) => ({
    title: article.title,
    url: absoluteUrl(`/${article.type === "blog" ? "blog" : "insights"}/${article.slug}`),
    description: article.excerpt,
    publishedAt: article.publishedAt,
    categories: [article.type, ...article.tags],
  }));

  const serviceItems: FeedItem[] = services
    .filter((service) => service.status === "published")
    .map((service) => ({
      title: service.title,
      url: absoluteUrl(`/services/${service.slug}`),
      description: service.shortDescription,
      categories: ["service", ...service.capabilities],
    }));

  const resourceItems: FeedItem[] = resources.map((resource) => ({
    title: resource.title,
    url: absoluteUrl(`/resources/${resource.slug}`),
    description: resource.shortDescription,
    publishedAt: resource.updatedAt || resource.createdAt,
    categories: ["resource", resource.type, resource.category],
  }));

  const items = [...articleItems, ...resourceItems, ...serviceItems]
    .sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    })
    .map((item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <description>${escapeXml(item.description)}</description>
      ${item.publishedAt ? `<pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>` : ""}
      <author>${escapeXml(siteConfig.email)} (${escapeXml(siteConfig.name)})</author>
      ${item.categories.map((category) => `<category>${escapeXml(category)}</category>`).join("")}
    </item>`)
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(siteConfig.name)} · Engineering Updates</title>
      <link>${siteConfig.url}</link>
      <description>${escapeXml(siteConfig.description)}</description>
      <language>en-GH</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
