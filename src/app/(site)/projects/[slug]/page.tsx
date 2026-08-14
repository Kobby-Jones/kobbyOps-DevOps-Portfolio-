import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Github } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import { projects } from "@/content/projects";
import { getProjectBySlug } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.summary;
  const canonical = `/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: project.media?.[0]
        ? [{ url: project.media[0].url, alt: project.media[0].alt }]
        : [{ url: absoluteUrl("/opengraph-image"), alt: project.title }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    codeRepository: project.repositories.map((repository) => repository.url),
    programmingLanguage: project.stack,
    dateCreated: project.year,
    author: { "@id": absoluteUrl("/#person"), name: siteConfig.name },
  };

  return (
    <>
      <JsonLd data={schema} />
      <article>
        <header className="page-hero">
          <div className="container-shell max-w-5xl">
            <Link className="text-link mb-8" href="/projects"><ArrowLeft size={15} /> All projects</Link>
            <p className="eyebrow">{project.eyebrow} · {project.year}</p>
            <h1 className="page-title max-w-4xl">{project.title}</h1>
            <p className="page-description max-w-3xl">{project.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.repositories.map((repository) => (
                <a className="button button-primary" href={repository.url} target="_blank" rel="noreferrer" key={repository.url}>
                  <Github size={16} /> {repository.label} <ArrowUpRight size={15} />
                </a>
              ))}
              {project.liveUrl && (
                <a className="button button-secondary" href={project.liveUrl} target="_blank" rel="noreferrer">
                  Live experience <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>
        </header>

        <section className="section-space border-t border-white/10">
          <div className="container-shell max-w-5xl">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["Challenge", project.challenge],
                ["Approach", project.solution],
                ["Result", project.outcome],
              ].map(([label, value]) => (
                <div className="surface-card p-6" key={label}>
                  <p className="eyebrow">{label}</p>
                  <p className="text-sm leading-7 text-zinc-400">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">Core capabilities</h2>
                <ul className="mt-6 space-y-4">
                  {project.capabilities.map((capability) => (
                    <li className="flex gap-3 text-sm leading-7 text-zinc-400" key={capability}>
                      <CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-400" /> {capability}
                    </li>
                  ))}
                </ul>
              </div>
              <aside className="surface-card p-6" aria-label="Project technology stack">
                <p className="eyebrow">Technology stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => <span className="tech-pill" key={item}>{item}</span>)}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {project.media && project.media.length > 0 && (
          <section className="section-space border-t border-white/10 bg-zinc-900/30">
            <div className="container-shell max-w-6xl">
              <p className="eyebrow">Architecture & evidence</p>
              <h2 className="section-title">See how the system moves.</h2>
              <p className="section-description">Architecture diagrams, animated data flows, and deployment evidence live with the case study.</p>
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {project.media.map((media) => (
                  <figure className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950" key={media.url}>
                    <div className="relative aspect-[16/10] bg-white/[0.02]">
                      <Image
                        src={media.url}
                        alt={media.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain p-3"
                      />
                    </div>
                    <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-zinc-500">{media.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-space border-t border-white/10">
          <div className="container-shell max-w-5xl">
            <div className="cta-panel">
              <div><p className="eyebrow">Discuss this work</p><h2 className="text-2xl font-semibold text-white md:text-3xl">Interested in the architecture or a similar build?</h2></div>
              <Link className="button button-primary" href="/contact">Start a conversation <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
