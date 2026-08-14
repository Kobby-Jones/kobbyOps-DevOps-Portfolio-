import ArticleCard from "./ArticleCard";
import type { Article } from "@/content/types";

export default function ArticleIndex({
  eyebrow,
  title,
  description,
  articles,
}: {
  eyebrow: string;
  title: string;
  description: string;
  articles: Article[];
}) {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell max-w-4xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-description mx-auto">{description}</p>
        </div>
      </section>
      <section className="section-space border-t border-white/10">
        <div className="container-shell">
          {articles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => <ArticleCard article={article} key={article.slug} />)}
            </div>
          ) : (
            <div className="surface-card mx-auto max-w-2xl p-10 text-center">
              <p className="text-lg font-semibold text-white">New writing is in progress.</p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">Please check back for the next publication.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
