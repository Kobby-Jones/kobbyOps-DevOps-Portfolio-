import { articles as staticArticles } from "@/content/articles";
import { projects as staticProjects } from "@/content/projects";
import { services as staticServices } from "@/content/services";
import type { Article, ContentType, Project, Resource, Service } from "@/content/types";
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

// ─── Services ────────────────────────────────────────────────────────────────

type ServiceRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string | null;
  capabilities: string[] | null;
  price_label: string | null;
  display_order: number;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
};

const toService = (row: ServiceRow): Service => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  shortDescription: row.short_description,
  description: row.description,
  icon: row.icon || undefined,
  capabilities: row.capabilities || [],
  priceLabel: row.price_label || undefined,
  displayOrder: row.display_order,
  status: row.status as "draft" | "published",
  seoTitle: row.seo_title || undefined,
  seoDescription: row.seo_description || undefined,
});

export async function getServices(): Promise<Service[]> {
  const supabase = createPublicSupabaseClient();
  let remote: Service[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (!error && data) remote = (data as ServiceRow[]).map(toService);
  }

  // Merge: DB takes priority by slug, fallback to static
  const merged = new Map(staticServices.map((s) => [s.slug, s]));
  remote.forEach((s) => merged.set(s.slug, s));
  return [...merged.values()].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const all = await getServices();
  return all.find((s) => s.slug === slug);
}

// ─── Resources ───────────────────────────────────────────────────────────────

type ResourceRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  type: string;
  category: string;
  price: number;
  currency: string;
  thumbnail_url: string | null;
  external_url: string | null;
  status: string;
  featured: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
  download_count: number;
  created_at: string;
  updated_at: string | null;
};

const toResource = (row: ResourceRow): Resource => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  shortDescription: row.short_description,
  description: row.description,
  type: row.type as Resource["type"],
  category: row.category as Resource["category"],
  price: Number(row.price),
  currency: row.currency,
  thumbnailUrl: row.thumbnail_url || undefined,
  externalUrl: row.external_url || undefined,
  status: row.status as "draft" | "published",
  featured: row.featured || false,
  seoTitle: row.seo_title || undefined,
  seoDescription: row.seo_description || undefined,
  downloadCount: row.download_count,
  createdAt: row.created_at,
  updatedAt: row.updated_at || undefined,
});

// Public columns — file_url is intentionally excluded
const RESOURCE_PUBLIC_COLUMNS =
  "id,title,slug,short_description,description,type,category,price,currency,thumbnail_url,external_url,status,featured,seo_title,seo_description,download_count,created_at,updated_at";

export async function getResources(type?: Resource["type"]): Promise<Resource[]> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  let query = supabase
    .from("resources")
    .select(RESOURCE_PUBLIC_COLUMNS)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as ResourceRow[]).map(toResource);
}

export async function getResourceBySlug(slug: string): Promise<Resource | undefined> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("resources")
    .select(RESOURCE_PUBLIC_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return undefined;
  return toResource(data as ResourceRow);
}
