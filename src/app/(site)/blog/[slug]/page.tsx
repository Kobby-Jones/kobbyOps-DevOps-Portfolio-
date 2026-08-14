import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/site/ArticleDetail";
import JsonLd from "@/components/site/JsonLd";
import { articles } from "@/content/articles";
import { getArticleBySlug } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return articles.filter((article) => article.type === "blog").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("blog", slug);
  if (!article) return {};
  const canonical = article.canonicalUrl || `/blog/${article.slug}`;
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: canonical,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.name],
      tags: article.tags,
      images: article.coverUrl ? [{ url: article.coverUrl, alt: article.title }] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug("blog", slug);
  if (!article) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
    author: { "@id": absoluteUrl("/#person"), name: siteConfig.name },
    publisher: { "@id": absoluteUrl("/#person"), name: siteConfig.name },
    keywords: article.tags.join(", "),
  };
  return <><JsonLd data={schema} /><ArticleDetail article={article} /></>;
}
