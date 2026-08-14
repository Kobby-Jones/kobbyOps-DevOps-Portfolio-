import type { ContentType } from "@/content/types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function cleanText(value: unknown, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parseContentPayload(input: Record<string, unknown>) {
  const type = cleanText(input.type, 20) as ContentType;
  const title = cleanText(input.title, 160);
  const slug = slugify(cleanText(input.slug, 100) || title);
  const excerpt = cleanText(input.excerpt, 320);
  const content = cleanText(input.content, 50000);
  const status = cleanText(input.status, 20) === "published" ? "published" : "draft";

  if (!(["blog", "insight"] as string[]).includes(type)) {
    throw new Error("Content type must be blog or insight.");
  }
  if (!title || !slug || !excerpt || !content) {
    throw new Error("Title, slug, excerpt, and content are required.");
  }

  const rawTags = Array.isArray(input.tags)
    ? input.tags
    : cleanText(input.tags, 500).split(",");

  return {
    id: cleanText(input.id, 80) || undefined,
    type,
    title,
    slug,
    excerpt,
    content,
    status,
    tags: rawTags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 12),
    cover_url: cleanText(input.coverUrl, 1000) || null,
    seo_title: cleanText(input.seoTitle, 180) || null,
    seo_description: cleanText(input.seoDescription, 320) || null,
    canonical_url: cleanText(input.canonicalUrl, 1000) || null,
    reading_minutes: Math.max(1, Math.min(60, Number(input.readingMinutes) || 5)),
    featured: Boolean(input.featured),
    published_at:
      cleanText(input.publishedAt, 40) ||
      (status === "published" ? new Date().toISOString() : new Date().toISOString()),
  };
}
