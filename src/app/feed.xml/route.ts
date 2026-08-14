import { getArticles } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] || character);

export async function GET() {
  const articles = await getArticles();
  const items = articles.map((article) => {
    const path = `/${article.type === "blog" ? "blog" : "insights"}/${article.slug}`;
    const url = absoluteUrl(path);
    return `<item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <author>${escapeXml(siteConfig.email)} (${escapeXml(siteConfig.name)})</author>
      ${article.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
    </item>`;
  }).join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(siteConfig.name)} · Engineering Writing</title>
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
