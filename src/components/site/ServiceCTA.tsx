import { ArrowRight } from "lucide-react";
import TrackedLink from "@/components/site/TrackedLink";

export default function ServiceCTA() {
  return (
    <aside className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">
        Need help with this?
      </p>
      <p className="mt-3 text-lg font-semibold text-white">
        I help teams build and deploy reliable production systems.
      </p>
      <p className="mt-2 text-sm leading-7 text-zinc-400">
        If you are working on a similar challenge — deployment, infrastructure, APIs,
        or cloud architecture — I may be able to help.
      </p>
      <TrackedLink
        href="/work-with-me"
        className="button button-primary mt-5 inline-flex"
        analyticsLabel="article_service_cta"
        analyticsMetadata={{ placement: "article_bottom" }}
      >
        Work with me <ArrowRight size={16} />
      </TrackedLink>
    </aside>
  );
}
