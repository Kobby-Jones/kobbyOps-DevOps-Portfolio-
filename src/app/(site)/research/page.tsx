import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Globe, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research interests in cloud-native intelligent systems, scalable infrastructure, AI-enabled software systems, and reliable computing architectures.",
  alternates: { canonical: "/research" },
};

const interests = [
  {
    title: "Cloud-Native Intelligent Systems",
    description:
      "Investigating how machine learning capabilities can be integrated into cloud-native application architectures while preserving operational reliability, explainability, and cost efficiency.",
    icon: <Globe size={20} />,
  },
  {
    title: "Scalable Infrastructure & Platform Engineering",
    description:
      "Exploring declarative infrastructure management, GitOps delivery models, and platform abstractions that reduce cognitive load for engineering teams operating distributed systems.",
    icon: <Layers size={20} />,
  },
  {
    title: "AI-Enabled Software Systems",
    description:
      "Studying how applied AI can augment software system workflows — classification, routing, anomaly detection, and decision support — in contexts where explainability and institutional trust matter.",
    icon: <FlaskConical size={20} />,
  },
  {
    title: "Reliable Computing Architectures",
    description:
      "Examining architectural patterns that improve system resilience: idempotency, graceful degradation, offline-first design, and failure-mode analysis in production environments.",
    icon: <BookOpen size={20} />,
  },
];

export default function ResearchPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell">
          <p className="eyebrow">Research</p>
          <h1 className="page-title max-w-3xl">
            Exploring the intersection of cloud-native systems and intelligent software.
          </h1>
          <p className="section-description max-w-2xl">
            My long-term trajectory connects software engineering practice with
            research — from production systems today toward cloud-native
            intelligent systems, graduate study, and published work.
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <h2 className="text-xl font-semibold text-white">Research interests</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            These interests are shaped by the engineering problems I encounter in
            practice. They represent directions I am actively exploring through
            projects, writing, and technical experiments.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {interests.map((interest) => (
              <div key={interest.title} className="surface-card p-6">
                <span className="skill-icon">{interest.icon}</span>
                <h3 className="mt-4 font-semibold text-white">
                  {interest.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {interest.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-white/10">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Academic trajectory
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                My professional path is designed to bridge engineering practice and
                academic research. The commercial consulting work provides the
                real-world systems experience that grounds future research in practical
                relevance.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  ["Current", "Software & Cloud Engineering"],
                  ["Active", "DevOps & Platform Engineering"],
                  ["Exploring", "Cloud-Native Intelligent Systems"],
                  ["Planned", "Graduate Research (MPhil → PhD)"],
                ].map(([stage, label]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-teal-400">
                      {stage}
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6">
              <h3 className="font-semibold text-white">
                Publications & presentations
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                No formal publications yet. As research progresses, this section will
                contain papers, conference presentations, technical reports, and
                datasets.
              </p>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                In the meantime, my technical writing covers the engineering ideas and
                system design thinking that will eventually inform research
                contributions.
              </p>
              <Link
                href="/blog"
                className="text-link mt-4 inline-flex items-center gap-2 text-sm"
              >
                Read technical writing <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
