import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import type { Article } from "@/content/types";
import MarkdownArticle from "./MarkdownArticle";

export default function ArticleDetail({ article }: { article: Article }) {
  const section = article.type === "blog" ? "blog" : "insights";
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(article.publishedAt));

  return (
    <article>
      <header className="page-hero">
        <div className="container-shell max-w-4xl">
          <Link className="text-link mb-8" href={`/${section}`}><ArrowLeft size={15} /> Back to {section}</Link>
          <p className="eyebrow capitalize">{article.type}</p>
          <h1 className="page-title">{article.title}</h1>
          <p className="page-description max-w-3xl">{article.excerpt}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span>Cobbina Emmanuel</span><span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt}>{date}</time><span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {article.readingMinutes} min read</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => <span className="tech-pill" key={tag}>{tag}</span>)}
          </div>
        </div>
      </header>
      <section className="section-space border-t border-white/10">
        <div className="container-shell max-w-3xl">
          {article.coverUrl && (
            <figure className="mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              {/* Admin cover URLs can use any trusted image host, so this intentionally stays unoptimized. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="aspect-[16/9] w-full object-cover" src={article.coverUrl} alt={`Cover for ${article.title}`} />
            </figure>
          )}
          <MarkdownArticle content={article.content} />
        </div>
      </section>
    </article>
  );
}
