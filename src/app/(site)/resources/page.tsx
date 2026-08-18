import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Lock } from "lucide-react";
import NewsletterSignup from "@/components/site/NewsletterSignup";
import SectionHeading from "@/components/site/SectionHeading";
import TrackedLink from "@/components/site/TrackedLink";
import { getResources } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free engineering resources, checklists, and premium digital products for cloud, DevOps, backend, and production deployment.",
  alternates: { canonical: "/resources" },
};

export default async function ResourcesPage() {
  const [freeResources, paidProducts] = await Promise.all([
    getResources("free_resource"),
    getResources("paid_product"),
  ]);

  const hasContent = freeResources.length > 0 || paidProducts.length > 0;

  return (
    <>
      <section className="page-hero">
        <div className="container-shell">
          <p className="eyebrow">Resources</p>
          <h1 className="page-title max-w-3xl">
            Practical engineering resources and tools.
          </h1>
          <p className="section-description max-w-2xl">
            Checklists, deployment kits, and technical guides built from real
            production experience. Free resources are available immediately — paid
            products include deeper material and source files.
          </p>
        </div>
      </section>

      {hasContent ? (
        <>
          {freeResources.length > 0 && (
            <section className="section-space">
              <div className="container-shell">
                <SectionHeading
                  eyebrow="Free resources"
                  title="Start here — no cost, no signup."
                  description="Practical checklists and guides you can use right away."
                />
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {freeResources.map((resource) => (
                    <div
                      key={resource.slug}
                      className="surface-card flex flex-col p-6"
                    >
                      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-400">
                        <Download size={13} /> Free
                      </span>
                      <h3 className="mt-3 font-semibold text-white">
                        {resource.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-7 text-zinc-400">
                        {resource.shortDescription}
                      </p>
                      <span className="mt-1 text-xs text-zinc-600 capitalize">
                        {resource.category.replace("_", "/")}
                      </span>
                      <Link className="text-link mt-5 inline-flex items-center gap-2 text-sm" href={`/resources/${resource.slug}`}>
                        View resource <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {paidProducts.length > 0 && (
            <section className="section-space border-t border-white/10">
              <div className="container-shell">
                <SectionHeading
                  eyebrow="Premium products"
                  title="Go deeper with production-ready material."
                  description="Templates, deployment kits, and project packs with source files and documentation."
                />
                <div className="mt-10 grid gap-5 md:grid-cols-2">
                  {paidProducts.map((product) => (
                    <div
                      key={product.slug}
                      className="surface-card flex flex-col p-6"
                    >
                      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-teal-400">
                        <Lock size={13} /> Premium
                      </span>
                      <h3 className="mt-3 font-semibold text-white">
                        {product.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-7 text-zinc-400">
                        {product.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-semibold text-white">
                          {product.currency === "USD" ? "$" : product.currency}
                          {product.price}
                        </span>
                        <span className="text-xs text-zinc-600 capitalize">
                          {product.category.replace("_", "/")}
                        </span>
                      </div>
                      <Link className="button button-secondary mt-5 w-full justify-center" href={`/resources/${product.slug}`}>
                        View product <ArrowRight size={15} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="section-space">
          <div className="container-shell">
            <div className="surface-card mx-auto max-w-2xl p-10 text-center">
              <h2 className="text-xl font-semibold text-white">
                Resources are on the way
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                I am currently building production-grade checklists, deployment kits, and
                technical guides. Subscribe below to be the first to know when they
                launch.
              </p>
              <TrackedLink
                href="/work-with-me"
                className="button button-primary mt-6 inline-flex"
                analyticsLabel="resources_work_with_me"
                analyticsMetadata={{ placement: "resources_empty_state" }}
              >
                Work with me in the meantime <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </section>
      )}

      <section className="section-space border-t border-white/10">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Stay updated</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Get notified when new resources launch.
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Technical guides, deployment checklists, and engineering resources
              delivered to your inbox — no spam.
            </p>
            <NewsletterSignup className="mt-6" />
          </div>
        </div>
      </section>
    </>
  );
}
