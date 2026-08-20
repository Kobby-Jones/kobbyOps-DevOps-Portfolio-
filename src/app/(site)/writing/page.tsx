import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArticleCard from "@/components/site/ArticleCard";
import SectionHeading from "@/components/site/SectionHeading";
import { getArticles } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Technical articles, engineering notes, and shorter insights on cloud engineering, DevOps, backend systems, and software architecture.",
  alternates: { canonical: "/writing" },
};

export default async function WritingPage() {
  const articles = await getArticles();
  const blogs = articles.filter((a) => a.type === "blog");
  const insights = articles.filter((a) => a.type === "insight");

  return (
    <>
      <section className="page-hero">
        <div className="container-shell">
          <p className="eyebrow">Writing</p>
          <h1 className="page-title max-w-3xl">
            Articles and engineering notes.
          </h1>
          <p className="section-description max-w-2xl">
            Longer articles on engineering problems, alongside shorter notes on systems, patterns and operational practice.
          </p>
        </div>
      </section>

      {blogs.length > 0 && (
        <section className="section-space">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Blog"
              title="Technical articles"
              description="Detailed articles on deployment, infrastructure, architecture and engineering decisions."
            />
            <div className="mt-10 grid gap-7 md:grid-cols-2">
              {blogs.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="text-link inline-flex items-center gap-2 text-sm">
                View all blog posts <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {insights.length > 0 && (
        <section className="section-space border-t border-white/10">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Insights"
              title="Short engineering notes"
              description="Concise notes on engineering patterns, system design and operational practice."
            />
            <div className="mt-10 grid gap-7 md:grid-cols-2">
              {insights.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/insights" className="text-link inline-flex items-center gap-2 text-sm">
                View all insights <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {blogs.length === 0 && insights.length === 0 && (
        <section className="section-space">
          <div className="container-shell">
            <div className="surface-card mx-auto max-w-2xl p-10 text-center">
              <h2 className="text-xl font-semibold text-white">Content coming soon</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Technical articles and insights are being published regularly. Check
                back soon.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
