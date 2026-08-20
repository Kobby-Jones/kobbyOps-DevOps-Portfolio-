import Link from "next/link";
import { ArrowRight, Download, LockKeyhole, PackageOpen } from "lucide-react";
import type { Resource } from "@/content/types";
import { resourceCategoryLabel } from "@/lib/resource-labels";
import {
  presentResourcePrice,
  type VisitorPricingContext,
} from "@/lib/resource-pricing";

export default function ResourceProductCard({
  resource,
  pricingContext,
}: {
  resource: Resource;
  pricingContext: VisitorPricingContext;
}) {
  const paid = resource.type === "paid_product";
  const price = paid
    ? presentResourcePrice(resource.price, resource.currency, pricingContext)
    : null;

  return (
    <article className="resource-product-card group">
      <Link
        href={`/resources/${resource.slug}`}
        className="resource-product-media"
        aria-label={`View ${resource.title}`}
      >
        {resource.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            src={resource.thumbnailUrl}
            alt={`Thumbnail for ${resource.title}`}
            loading="lazy"
          />
        ) : (
          <div className="resource-product-placeholder">
            <PackageOpen size={34} aria-hidden="true" />
          </div>
        )}
        <div className="resource-product-media-shade" />
        <span className={`resource-product-type-badge ${paid ? "resource-product-type-badge-premium" : "resource-product-type-badge-free"}`}>
          {paid ? <LockKeyhole size={13} /> : <Download size={13} />}
          {paid ? "Premium" : "Free"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div>
          <span className="resource-category-chip">
            {resourceCategoryLabel(resource.category)}
          </span>
          <h3 className="mt-4 text-lg font-semibold leading-snug text-white transition group-hover:text-teal-100">
            <Link href={`/resources/${resource.slug}`}>{resource.title}</Link>
          </h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            {resource.shortDescription}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <div className="resource-product-price-panel">
            <div>
              <p className="resource-product-price-label">
                {paid ? price?.currencyLabel : "Access"}
              </p>
              <p className="resource-product-price">
                {paid ? price?.primary : "Free"}
              </p>
              {paid && price?.note ? (
                <p className="resource-product-price-note">{price.note}</p>
              ) : (
                <p className="resource-product-price-note">
                  {paid ? "Secure digital delivery" : "No payment required"}
                </p>
              )}
            </div>
          </div>

          <Link
            className={paid ? "button button-primary mt-4 w-full" : "button button-secondary mt-4 w-full"}
            href={`/resources/${resource.slug}`}
          >
            {paid ? "View product" : "View resource"}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
