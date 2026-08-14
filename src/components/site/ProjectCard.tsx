import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import type { Project } from "@/content/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card group">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow !mb-0">{project.eyebrow}</p>
        <span className="text-xs font-medium text-zinc-600">{project.year}</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold tracking-tight text-white md:text-2xl">
        <Link href={`/projects/${project.slug}`} className="focus-outline">
          {project.title}
        </Link>
      </h3>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-zinc-400">{project.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 5).map((item) => (
          <span key={item} className="tech-pill">{item}</span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-4 pt-8">
        <Link className="text-link" href={`/projects/${project.slug}`}>
          View case study <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <a
          href={project.repositories[0].url}
          target="_blank"
          rel="noreferrer"
          className="icon-link"
          aria-label={`Open ${project.title} repository`}
        >
          <Github size={17} />
        </a>
      </div>
    </article>
  );
}
