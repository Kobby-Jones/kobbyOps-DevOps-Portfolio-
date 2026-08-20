import type { Metadata } from "next";
import ProjectCard from "@/components/site/ProjectCard";
import JsonLd from "@/components/site/JsonLd";
import { getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Software, Cloud & DevOps Projects",
  description:
    "Explore Cobbina Emmanuel's software engineering, AWS, DevOps, platform engineering, applied AI, backend, Docker, Kubernetes, and GitOps projects with source links.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cobbina Emmanuel's engineering projects",
    url: absoluteUrl("/projects"),
    mainEntity: projects.map((project, index) => ({
      "@type": "SoftwareSourceCode",
      position: index + 1,
      name: project.title,
      description: project.summary,
      codeRepository: project.repositories[0].url,
      url: absoluteUrl(`/projects/${project.slug}`),
      programmingLanguage: project.stack,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="page-hero">
        <div className="container-shell max-w-4xl text-center">
          <p className="eyebrow">Selected work</p>
          <h1 className="page-title">Engineering projects with the design decisions and source code in view.</h1>
          <p className="page-description mx-auto">
            Each case study covers the problem, implementation approach, core capabilities, technology choices, architecture material where available and the source repository.
          </p>
        </div>
      </section>
      <section className="section-space border-t border-white/10">
        <div className="container-shell grid gap-5 md:grid-cols-2">
          {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>
    </>
  );
}
