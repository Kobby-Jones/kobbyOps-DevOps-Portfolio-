import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Lock } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import MarkdownArticle from "@/components/site/MarkdownArticle";
import ResourceCheckout from "@/components/site/ResourceCheckout";
import TrackedAnchor from "@/components/site/TrackedAnchor";
import { getResourceBySlug } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

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
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  const paid = resource.type === "paid_product";
  const downloadHref = `/api/download/free/${encodeURIComponent(resource.slug)}`;
  const freeHref = resource.hasDownload ? downloadHref : resource.externalUrl || downloadHref;
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
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="tech-pill capitalize">{resource.category.replace("_", "/")}</span>
            <span className="text-lg font-semibold text-white">
              {paid ? formatPrice(resource.price, resource.currency) : "Free"}
            </span>
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
                resource.id ? <ResourceCheckout resourceId={resource.id} resourceSlug={resource.slug} /> : null
              ) : (
                <div className="surface-card p-6">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
                    <Download size={16} className="text-teal-400" /> Available now
                  </span>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    This resource is free. Use the button below to open or download it.
                  </p>
                  <TrackedAnchor
                    className="button button-primary mt-6 w-full justify-center"
                    href={freeHref}
                    target={!resource.hasDownload && resource.externalUrl ? "_blank" : undefined}
                    rel={!resource.hasDownload && resource.externalUrl ? "noreferrer" : undefined}
                    analyticsLabel={resource.hasDownload ? "resource_free_download" : "resource_external_open"}
                    analyticsMetadata={{
                      placement: "resource_detail",
                      resourceSlug: resource.slug,
                    }}
                  >
                    {resource.hasDownload ? <>Download free <Download size={16} /></> : <>Open resource <ExternalLink size={16} /></>}
                  </TrackedAnchor>
                  {resource.hasDownload && resource.externalUrl ? (
                    <TrackedAnchor
                      className="button button-secondary mt-3 w-full justify-center"
                      href={resource.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      analyticsLabel="resource_external_open"
                      analyticsMetadata={{ placement: "resource_detail_secondary", resourceSlug: resource.slug }}
                    >
                      Open external resource <ExternalLink size={16} />
                    </TrackedAnchor>
                  ) : null}
                </div>
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
                  Download access is issued only after the payment provider webhook confirms the transaction.
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
