import type { Metadata } from "next";
import ArticleIndex from "@/components/site/ArticleIndex";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cloud, DevOps & Software Engineering Insights",
  description:
    "Concise engineering insights from Cobbina Emmanuel on platform design, cloud operations, API reliability, DevOps, GitOps, security, and technical decision-making.",
  alternates: { canonical: "/insights" },
};

export const revalidate = 300;

export default async function InsightsPage() {
  const articles = await getArticles("insight");
  return (
    <ArticleIndex
      eyebrow="Engineering insights"
      title="Clear positions on how dependable systems are built."
      description="Shorter research-backed perspectives on software, cloud platforms, reliability, security, delivery, and the engineering decisions behind them."
      articles={articles}
    />
  );
}
