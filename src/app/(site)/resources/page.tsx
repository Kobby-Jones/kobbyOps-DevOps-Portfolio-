import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import NewsletterSignup from "@/components/site/NewsletterSignup";
import ResourceProductCard from "@/components/site/ResourceProductCard";
import SectionHeading from "@/components/site/SectionHeading";
import TrackedLink from "@/components/site/TrackedLink";
import { getResources } from "@/lib/content";
import { getVisitorPricingContext } from "@/lib/resource-pricing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free engineering resources, checklists, and premium digital products for cloud, DevOps, backend, and production deployment.",
  alternates: { canonical: "/resources" },
};

export default async function ResourcesPage() {
  const [freeResources, paidProducts, pricingContext] = await Promise.all([
    getResources("free_resource"),
    getResources("paid_product"),
    getVisitorPricingContext(),
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
            production experience. Free resources are available immediately. Paid
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
                  title="Useful resources you can access immediately."
                  description="Practical checklists and guides you can use right away."
                />
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {freeResources.map((resource) => (
                    <ResourceProductCard
                      key={resource.slug}
                      resource={resource}
                      pricingContext={pricingContext}
                    />
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
                  title="Detailed guides, templates and project files."
                  description="Paid resources with supporting files, documentation and practical implementation material."
                />
                <div className="mt-10 grid gap-5 md:grid-cols-2">
                  {paidProducts.map((product) => (
                    <ResourceProductCard
                      key={product.slug}
                      resource={product}
                      pricingContext={pricingContext}
                    />
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
                I am currently building practical checklists, deployment kits, and
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
              delivered to your inbox. No unnecessary emails.
            </p>
            <NewsletterSignup className="mt-6" />
          </div>
        </div>
      </section>
    </>
  );
}
