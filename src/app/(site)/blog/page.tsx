import type { Metadata } from "next";
import ArticleIndex from "@/components/site/ArticleIndex";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Software & Cloud Engineering Blog",
  description:
    "Technical articles by Cobbina Emmanuel about software architecture, AWS, backend engineering, DevOps, platform engineering, APIs, and reliable delivery.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 300;

export default async function BlogPage() {
  const articles = await getArticles("blog");
  return (
    <ArticleIndex
      eyebrow="Engineering blog"
      title="Detailed notes from building real systems."
      description="Long-form walkthroughs covering architecture, implementation choices, delivery patterns, debugging lessons, and the trade-offs that matter after launch."
      articles={articles}
    />
  );
}
