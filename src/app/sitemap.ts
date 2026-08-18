import type { MetadataRoute } from "next";
import { getArticles, getProjects, getResources, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, projects, services, resources] = await Promise.all([
    getArticles(),
    getProjects(),
    getServices(),
    getResources(),
  ]);
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/projects"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/work-with-me"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/insights"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/writing"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/resources"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/research"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
  const servicePages: MetadataRoute.Sitemap = services
    .filter((s) => s.status === "published")
    .map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    }));
  const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: absoluteUrl(`/resources/${resource.slug}`),
    lastModified: new Date(resource.updatedAt || resource.createdAt),
    changeFrequency: "monthly",
    priority: resource.featured ? 0.8 : 0.65,
  }));
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
  return [...staticPages, ...servicePages, ...resourcePages, ...projectPages, ...articlePages];
}
