import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Cloud,
  Code2,
  Download,
  MapPin,
  ServerCog,
} from "lucide-react";
import ArticleCard from "@/components/site/ArticleCard";
import ProjectCard from "@/components/site/ProjectCard";
import SectionHeading from "@/components/site/SectionHeading";
import SkillGrid from "@/components/site/SkillGrid";
import { certifications, experience } from "@/content/profile";
import { getArticles, getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const [projects, articles] = await Promise.all([getProjects(), getArticles()]);
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 4);

  return (
    <>
      <section className="hero-section">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="container-shell relative py-20 md:py-28 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              <div className="status-pill">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
                Building dependable systems from Ghana
              </div>
              <h1 className="hero-title mt-7">
                Cobbina Emmanuel builds <span>secure software</span> and cloud platforms that hold up in production.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg md:leading-9">
                I am a Software & Cloud Engineer working across backend systems, AWS infrastructure, containers, CI/CD, platform engineering, and full-stack product delivery.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="button button-primary" href="/projects">
                  Explore selected work <ArrowRight size={17} />
                </Link>
                <a className="button button-secondary" href={siteConfig.resume} download>
                  Download CV <Download size={16} />
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500">
                <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-teal-400" /> {siteConfig.location}</span>
                <span className="inline-flex items-center gap-2"><Award size={15} className="text-teal-400" /> AWS Solutions Architect - Associate</span>
              </div>
            </div>
    <div className="mx-auto w-full max-w-xl lg:ml-auto">
  <div className="mx-auto w-full max-w-md">
    <div className="profile-frame profile-frame-circle">
      <div className="relative aspect-square overflow-hidden rounded-full">
        <Image
          src="/images/profile.jpg"
          alt="Cobbina Emmanuel, Software and Cloud Engineer in Ghana"
          fill
          priority
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 420px, 34vw"
          className="object-cover object-[center_24%] grayscale-[12%]"
        />
      </div>
    </div>
  </div>

  <div className="mx-auto mt-7 grid max-w-md gap-3 sm:grid-cols-2">
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 shadow-[0_16px_38px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal-400/20 bg-teal-400/10">
        <Cloud size={18} className="text-teal-400" />
      </span>

      <span>
        <strong className="block text-xs font-semibold text-zinc-100">
          AWS certified
        </strong>
        <span className="mt-1 block text-[0.68rem] leading-4 text-zinc-500">
          Solutions Architect - Associate
        </span>
      </span>
    </div>

    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 shadow-[0_16px_38px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
        <ServerCog size={18} className="text-emerald-400" />
      </span>

      <span>
        <strong className="block text-xs font-semibold text-zinc-100">
          Production-minded
        </strong>
        <span className="mt-1 block text-[0.68rem] leading-4 text-zinc-500">
          Build, ship, observe, improve
        </span>
      </span>
    </div>
  </div>

  <div className="profile-focus-card mx-auto mt-3 max-w-md text-center">
    <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-teal-300">
      Current focus
    </p>
    <p className="mt-2 text-base font-semibold text-white">
      Cloud-native application delivery
    </p>
    <p className="mt-1 text-sm text-zinc-400">
      Secure APIs · Platform automation · Reliable operations
    </p>
  </div>
</div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950/70">
        <div className="container-shell grid gap-px py-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Role", "Senior ICT Assistant · UENR"],
            ["Core", "Software & cloud engineering"],
            ["Credentials", "2 active AWS certifications"],
            ["Delivery", "Web · Mobile · API · Infrastructure"],
          ].map(([label, value]) => (
            <div className="px-5 py-6" key={label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-500">{label}</p>
              <p className="mt-2 text-sm font-medium text-zinc-300">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Selected projects"
            title="Engineering work with the architecture visible."
            description="Case studies connect product decisions to implementation, deployment, reliability, and the source repositories behind the work."
            action={<Link href="/projects" className="text-link">All projects <ArrowRight size={15} /></Link>}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {featuredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-white/10 bg-zinc-900/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Capabilities"
            title="Tools are useful when they support a sound engineering system."
            description="My work combines cloud and platform tooling with application engineering, data design, security, documentation, and operational thinking."
          />
          <div className="mt-12"><SkillGrid /></div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Experience</p>
              <h2 className="section-title">Engineering, institutional technology, and research.</h2>
              <p className="section-description">
                My background crosses software delivery, cloud engineering, data work, technical support, teaching, and research communication.
              </p>
              <Link className="button button-secondary mt-7" href="/about">
                Full profile <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {experience.slice(0, 3).map((item) => (
                <article className="experience-row" key={`${item.role}-${item.organization}`}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{item.role}</h3>
                      {item.current && <span className="current-badge">Current</span>}
                    </div>
                    <p className="mt-1 text-sm text-teal-400">{item.organization}</p>
                  </div>
                  <time className="text-xs text-zinc-500">{item.period}</time>
                </article>
              ))}
              <div className="grid gap-3 pt-3 sm:grid-cols-2">
                {certifications.map((certification) => (
                  <div className="surface-card flex gap-3 p-4" key={certification.name}>
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                    <div><p className="text-sm font-medium text-zinc-200">{certification.name}</p><p className="mt-1 text-xs text-zinc-600">{certification.issuer} · {certification.year}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-t border-white/10 bg-zinc-900/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Writing & insights"
            title="What I learn while building systems."
            description="Practical notes on architecture, platform engineering, APIs, cloud operations, and the decisions behind reliable software."
            action={<Link href="/blog" className="text-link">Browse writing <ArrowRight size={15} /></Link>}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => <ArticleCard article={article} key={article.slug} />)}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="cta-panel">
            <div>
              <p className="eyebrow">Build something dependable</p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Need a software or cloud engineer who can connect code, infrastructure, and operations?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Let&apos;s discuss the system, the constraints, and the delivery path.
              </p>
            </div>
            <Link className="button button-primary shrink-0" href="/contact">Contact me <Code2 size={17} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
