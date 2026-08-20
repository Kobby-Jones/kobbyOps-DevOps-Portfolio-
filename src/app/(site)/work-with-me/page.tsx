import type { Metadata } from "next";
import { Mail } from "lucide-react";
import ConsultationForm from "@/components/site/ConsultationForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Hire Cobbina Emmanuel for Cloud & DevOps engineering, backend development, production readiness audits, architecture consulting, and technical mentorship.",
  alternates: { canonical: "/work-with-me" },
};

export default function WorkWithMePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell">
          <p className="eyebrow">Work with me</p>
          <h1 className="page-title max-w-3xl">
            Tell me what you are building and where you need support.
          </h1>
          <p className="section-description max-w-2xl">
            Share the project context, constraints and timeline. I review each request personally and usually respond within 1–2 business days.
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <ConsultationForm />
            </div>

            <div className="space-y-6">
              <div className="surface-card p-6">
                <h3 className="font-semibold text-white">What to expect</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
                  <li>
                    <strong className="text-zinc-200">Response within 1–2 days.</strong>{" "}
                    I read and respond to each project enquiry.
                  </li>
                  <li>
                    <strong className="text-zinc-200">No obligation.</strong>{" "}
                    An initial conversation helps us decide whether the engagement is a good fit.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Clear scope and pricing.</strong>{" "}
                    I provide a written proposal before any work begins.
                  </li>
                </ul>
              </div>

              <div className="surface-card p-6">
                <h3 className="font-semibold text-white">Prefer email?</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  You can also reach me directly at:
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300"
                >
                  <Mail size={15} />
                  {siteConfig.email}
                </a>
              </div>

              <div className="surface-card p-6">
                <h3 className="font-semibold text-white">Services I offer</h3>
                <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                  <li>Cloud & DevOps Engineering</li>
                  <li>Backend Engineering</li>
                  <li>Production Readiness Audit</li>
                  <li>Architecture Consulting</li>
                  <li>Technical Mentorship</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
