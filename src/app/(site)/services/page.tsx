import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Code2,
  Layers,
  ShieldCheck,
} from "lucide-react";
import TrackedLink from "@/components/site/TrackedLink";
import { getServices } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Software and cloud engineering services covering Cloud and DevOps, Backend Engineering, Production Readiness Audits, and Architecture Consulting.",
  alternates: { canonical: "/services" },
};

const iconMap: Record<string, React.ReactNode> = {
  cloud: <Cloud size={22} />,
  code: <Code2 size={22} />,
  shield: <ShieldCheck size={22} />,
  layers: <Layers size={22} />,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="page-hero">
        <div className="container-shell">
          <p className="eyebrow">Services</p>
          <h1 className="page-title max-w-3xl">
            Engineering services for teams that need systems to work in production.
          </h1>
          <p className="section-description max-w-2xl">
            I help organisations design, build, deploy and operate reliable software systems. Each engagement starts with the technical context, constraints and delivery requirements.
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-6 md:grid-cols-2">
            {services
              .filter((s) => s.status === "published")
              .map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="surface-card group flex flex-col p-7 transition-colors hover:border-teal-400/30"
                >
                  <span className="skill-icon">
                    {iconMap[service.icon || ""] || <Code2 size={22} />}
                  </span>
                  <h2 className="mt-5 text-xl font-semibold text-white group-hover:text-teal-300">
                    {service.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">
                    {service.shortDescription}
                  </p>
                  {service.priceLabel && (
                    <p className="mt-4 text-xs font-medium text-teal-400">
                      {service.priceLabel}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-400 group-hover:gap-3">
                    Learn more <ArrowRight size={15} />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-white/10">
        <div className="container-shell">
          <div className="cta-panel">
            <div>
              <p className="eyebrow">Project enquiries</p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Tell me what you are building and where you need support.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Share the project context, timeline and constraints. I respond personally to project enquiries.
              </p>
            </div>
            <TrackedLink
              className="button button-primary shrink-0"
              href="/work-with-me"
              analyticsLabel="services_work_with_me"
              analyticsMetadata={{ placement: "services_bottom_cta" }}
            >
              Work with me <ArrowRight size={17} />
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}
