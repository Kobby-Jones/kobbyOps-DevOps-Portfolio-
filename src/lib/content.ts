import { articles as staticArticles } from "@/content/articles";
import { projects as staticProjects } from "@/content/projects";
import type { Article, ContentType, Project } from "@/content/types";
import { createPublicSupabaseClient } from "./supabase";

type ContentRow = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[] | null;
  cover_url: string | null;
  published_at: string;
  updated_at: string | null;
  reading_minutes: number | null;
  featured: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
};

const toArticle = (row: ContentRow): Article => ({
  id: row.id,
  type: row.type,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  tags: row.tags || [],
  coverUrl: row.cover_url || undefined,
  publishedAt: row.published_at,
  updatedAt: row.updated_at || undefined,
  readingMinutes: row.reading_minutes || 5,
  featured: row.featured || false,
  seoTitle: row.seo_title || undefined,
  seoDescription: row.seo_description || undefined,
  canonicalUrl: row.canonical_url || undefined,
});

function mergeArticles(remote: Article[]) {
  const merged = new Map(staticArticles.map((article) => [article.slug, article]));
  remote.forEach((article) => merged.set(article.slug, article));
  return [...merged.values()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getArticles(type?: ContentType): Promise<Article[]> {
  const supabase = createPublicSupabaseClient();
  let remote: Article[] = [];

  if (supabase) {
    let query = supabase
      .from("content_items")
      .select("*")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    if (!error && data) remote = (data as ContentRow[]).map(toArticle);
  }

  const merged = mergeArticles(remote);
  return type ? merged.filter((article) => article.type === type) : merged;
}

export async function getArticleBySlug(
  type: ContentType,
  slug: string,
): Promise<Article | undefined> {
  const articles = await getArticles(type);
  return articles.find((article) => article.slug === slug);
}

export async function getProjects(): Promise<Project[]> {
  return [...staticProjects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return Number(b.year) - Number(a.year);
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return staticProjects.find((project) => project.slug === slug);
}
