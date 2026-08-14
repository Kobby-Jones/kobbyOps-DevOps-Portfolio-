import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { Article } from "@/content/types";

export default function ArticleCard({ article }: { article: Article }) {
  const href = `/${article.type === "blog" ? "blog" : "insights"}/${article.slug}`;
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(article.publishedAt));

  return (
    <article className="article-card group">
      {article.coverUrl && (
        <div className="-mx-1 -mt-1 mb-6 aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          {/* Admin cover URLs can use any trusted image host, so this intentionally stays unoptimized. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-full w-full object-cover" src={article.coverUrl} alt={`Cover for ${article.title}`} loading="lazy" />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-500">
        <span className="capitalize text-teal-400">{article.type}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={article.publishedAt}>{date}</time>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={13} aria-hidden="true" /> {article.readingMinutes} min read
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
        <Link href={href} className="focus-outline">{article.title}</Link>
      </h3>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{article.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.slice(0, 3).map((tag) => <span className="tech-pill" key={tag}>{tag}</span>)}
      </div>
      <Link href={href} className="text-link mt-7">
        Read article <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </article>
  );
}
