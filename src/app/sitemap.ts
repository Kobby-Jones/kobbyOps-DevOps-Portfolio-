import type { MetadataRoute } from "next";
import { getArticles, getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, projects] = await Promise.all([getArticles(), getProjects()]);
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/projects"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/insights"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(`${project.year}-01-01`),
    changeFrequency: "monthly",
    priority: project.featured ? 0.85 : 0.7,
  }));
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/${article.type === "blog" ? "blog" : "insights"}/${article.slug}`),
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly",
    priority: article.featured ? 0.85 : 0.7,
  }));
  return [...staticPages, ...projectPages, ...articlePages];
}
