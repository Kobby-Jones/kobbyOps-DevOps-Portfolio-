import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import MarkdownArticle from "@/components/site/MarkdownArticle";
import FreeDownloadGate from "@/components/site/FreeDownloadGate";
import ResourceCheckout from "@/components/site/ResourceCheckout";
import TrackedAnchor from "@/components/site/TrackedAnchor";
import { getResourceBySlug } from "@/lib/content";
import { resourceCategoryLabel } from "@/lib/resource-labels";
import { getVisitorPricingContext, presentResourcePrice } from "@/lib/resource-pricing";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return {};

  return {
    title: resource.seoTitle || resource.title,
    description: resource.seoDescription || resource.shortDescription,
    alternates: { canonical: `/resources/${slug}` },
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [resource, pricingContext] = await Promise.all([
    getResourceBySlug(slug),
    getVisitorPricingContext(),
  ]);
  if (!resource) notFound();

  const paid = resource.type === "paid_product";
  const price = paid
    ? presentResourcePrice(resource.price, resource.currency, pricingContext)
    : null;
  const productUrl = absoluteUrl(`/resources/${resource.slug}`);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: resource.title,
    description: resource.shortDescription,
    url: productUrl,
    category: resource.category.replace("_", "/"),
    ...(resource.thumbnailUrl ? { image: [absoluteUrl(resource.thumbnailUrl)] } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: (paid ? resource.price : 0).toFixed(2),
      priceCurrency: resource.currency,
      availability: "https://schema.org/InStock",
      seller: { "@id": absoluteUrl("/#person") },
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <section className="page-hero">
        <div className="container-shell">
          <Link href="/resources" className="text-link mb-6 inline-flex items-center gap-2 text-sm">
            <ArrowLeft size={15} /> All resources
          </Link>
          <p className="eyebrow">{paid ? "Premium product" : "Free resource"}</p>
          <h1 className="page-title max-w-3xl">{resource.title}</h1>
          <p className="section-description max-w-2xl">{resource.shortDescription}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="resource-category-chip resource-category-chip-large">
              {resourceCategoryLabel(resource.category)}
            </span>
            <div className="resource-detail-price">
              <span className="resource-product-price-label">
                {paid ? price?.currencyLabel : "Access"}
              </span>
              <strong>{paid ? price?.primary : "Free"}</strong>
              {paid && price?.note ? <small>{price.note}</small> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              {resource.thumbnailUrl && (
                <figure className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="aspect-[16/9] w-full object-cover" src={resource.thumbnailUrl} alt={`Thumbnail for ${resource.title}`} />
                </figure>
              )}
              <h2 className="text-xl font-semibold text-white">About this resource</h2>
              <div className="mt-6">
                <MarkdownArticle content={resource.description} />
              </div>
            </div>

            <aside>
              {paid ? (
                resource.id ? (
                  <ResourceCheckout
                    resourceId={resource.id}
                    resourceSlug={resource.slug}
                    displayPrice={price?.primary}
                    priceLabel={price?.currencyLabel}
                    priceNote={price?.note}
                  />
                ) : null
              ) : (
                <FreeDownloadGate
                  resourceSlug={resource.slug}
                  hasDownload={!!resource.hasDownload}
                  externalUrl={resource.externalUrl}
                />
              )}

              {paid && resource.externalUrl ? (
                <TrackedAnchor
                  className="button button-secondary mt-4 w-full justify-center"
                  href={resource.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  analyticsLabel="resource_external_open"
                  analyticsMetadata={{ placement: "paid_resource_detail", resourceSlug: resource.slug }}
                >
                  Related external link <ExternalLink size={16} />
                </TrackedAnchor>
              ) : null}

              {paid ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-6 text-zinc-500">
                  <Lock size={15} className="mt-0.5 shrink-0 text-teal-400" />
                  Download access is issued only after the payment provider confirms the transaction.
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
