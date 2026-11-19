import type { MetadataRoute } from "next";
import { getArticles, getProjects, getResources, getServices } from "@/lib/content";
import { absoluteUrl, articleCanonicalUrl } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, projects, services, resources] = await Promise.all([
    getArticles(),
    getProjects(),
    getServices(),
    getResources(),
  ]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/work-with-me"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/insights"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/writing"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/resources"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/research"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];
  const servicePages: MetadataRoute.Sitemap = services
    .filter((s) => s.status === "published")
    .map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
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
    changeFrequency: "monthly",
    priority: project.featured ? 0.85 : 0.7,
  }));
  const articlePages: MetadataRoute.Sitemap = articles.flatMap((article) => {
    const url = absoluteUrl(`/${article.type === "blog" ? "blog" : "insights"}/${article.slug}`);
    if (articleCanonicalUrl(article) !== url) return [];
    return [{
      url,
      lastModified: new Date(article.updatedAt || article.publishedAt),
      changeFrequency: "monthly",
      priority: article.featured ? 0.85 : 0.7,
    }];
  });
  return [...staticPages, ...servicePages, ...resourcePages, ...projectPages, ...articlePages];
}
