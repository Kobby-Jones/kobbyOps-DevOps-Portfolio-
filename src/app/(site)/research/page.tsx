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
    title: "Scalable Infrastructure and Platform Engineering",
    description:
      "Exploring declarative infrastructure management, GitOps delivery models, and platform abstractions that reduce cognitive load for engineering teams operating distributed systems.",
    icon: <Layers size={20} />,
  },
  {
    title: "AI-Enabled Software Systems",
    description:
      "Studying how applied AI can support software workflows such as classification, routing, anomaly detection and decision support, especially where explainability and institutional trust matter.",
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
            My long-term direction connects software engineering practice with research, with a focus on cloud-native intelligent systems and future graduate study.
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
                Research direction
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                My work currently sits between engineering practice and research. Commercial and institutional projects provide practical systems experience that can inform future academic work.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  ["Current", "Software and Cloud Engineering"],
                  ["Active", "DevOps and Platform Engineering"],
                  ["Exploring", "Cloud-Native Intelligent Systems"],
                  ["Planned", "Graduate research (MPhil, then PhD)"],
                ].map(([stage, label]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <span className="w-20 shrink-0 text-xs font-semibold tracking-[0.03em] text-teal-400">
                      {stage}
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6">
              <h3 className="font-semibold text-white">
                Publications and presentations
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
