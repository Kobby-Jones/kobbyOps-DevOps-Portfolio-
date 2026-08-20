import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Download, GraduationCap, MapPin } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import SkillGrid from "@/components/site/SkillGrid";
import { certifications, experience } from "@/content/profile";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Cobbina Emmanuel, a Software and Cloud Engineer in Ghana with experience in AWS, backend development, DevOps, institutional technology, and research.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero !pt-10 md:!pt-14 lg:!pt-16">
        <div className="container-shell">
          <div className="grid items-start gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="profile-frame profile-frame-circle">
                <div className="relative aspect-square overflow-hidden rounded-full">
                  <Image
                    src="/images/profile.jpg"
                    alt="Portrait of Cobbina Emmanuel"
                    fill
                    priority
                    sizes="(max-width: 1024px) 80vw, 32vw"
                    className="object-cover object-[center_24%]"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="eyebrow">About me</p>
              <h1 className="page-title">I work across software, cloud infrastructure and the operations that keep systems running.</h1>
              <div className="mt-7 space-y-5 text-base leading-8 text-zinc-400">
                <p>
                  I am Cobbina Emmanuel, a Software and Cloud Engineer based in Accra, Ghana. My work spans backend APIs, full-stack products, AWS services, container platforms, delivery automation, data systems, and technical documentation.
                </p>
                <p>
                  I currently support institutional technology and data work at the University of Energy and Natural Resources while delivering software through freelance and contract engagements. That combination keeps me close to both technical implementation and the everyday realities of the people who use a system.
                </p>
                <p>
                  I am especially interested in dependable platforms: systems with clear boundaries, secure defaults, observable behaviour, useful documentation, and a delivery path that another engineer can reproduce.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="button button-primary" href={siteConfig.resume} download>Download CV <Download size={16} /></a>
                <Link className="button button-secondary" href="/contact">Contact me <ArrowUpRight size={16} /></Link>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-500"><MapPin size={15} className="text-teal-400" /> {siteConfig.location}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-t border-white/10 bg-zinc-900/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Experience"
            title="Experience across software delivery, operations and research."
            description="A summary of my current and recent roles, responsibilities and technical work."
          />
          <div className="relative mt-12 space-y-5 before:absolute before:bottom-2 before:left-[17px] before:top-2 before:w-px before:bg-white/10">
            {experience.map((item) => (
              <article className="relative grid gap-5 pl-12 md:grid-cols-[0.34fr_0.66fr]" key={`${item.role}-${item.organization}`}>
                <span className="absolute left-3 top-6 h-[11px] w-[11px] rounded-full border-2 border-zinc-950 bg-teal-400 shadow-[0_0_0_4px_rgba(45,212,191,0.12)]" />
                <div className="py-5">
                  <p className="text-xs font-semibold tracking-[0.04em] text-zinc-500">{item.period}</p>
                  <p className="mt-2 text-sm text-zinc-600">{item.location}</p>
                </div>
                <div className="surface-card p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{item.role}</h3>
                    {item.current && <span className="current-badge">Current</span>}
                  </div>
                  <p className="mt-1 text-sm font-medium text-teal-400">{item.organization}</p>
                  <ul className="mt-5 space-y-3">
                    {item.details.map((detail) => (
                      <li className="flex gap-3 text-sm leading-6 text-zinc-400" key={detail}>
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-emerald-400" /> {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="surface-card p-7 md:p-8">
              <span className="skill-icon"><GraduationCap size={23} /></span>
              <p className="mt-6 eyebrow">Education</p>
              <h2 className="text-xl font-semibold text-white">Bachelor of Science in Computer Science</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">University of Energy and Natural Resources, Sunyani, Ghana</p>
            </div>
            <div className="surface-card p-7 md:p-8">
              <p className="eyebrow">Certifications</p>
              <div className="space-y-5">
                {certifications.map((certification) => (
                  <div className="flex gap-3" key={certification.name}>
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                    <div><h2 className="text-sm font-semibold text-white">{certification.name}</h2><p className="mt-1 text-xs text-zinc-500">{certification.issuer}, {certification.year}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-t border-white/10 bg-zinc-900/30">
        <div className="container-shell">
          <SectionHeading eyebrow="Technical profile" title="Tools and practices I use in day-to-day engineering." />
          <div className="mt-12"><SkillGrid /></div>
        </div>
      </section>
    </>
  );
}
