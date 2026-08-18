import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import ConversionTracker from "@/components/site/ConversionTracker";
import JsonLd from "@/components/site/JsonLd";
import TrackedLink from "@/components/site/TrackedLink";
import { getServiceBySlug, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    alternates: { canonical: `/services/${slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const serviceUrl = absoluteUrl(`/services/${service.slug}`);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.title,
    description: service.shortDescription,
    url: serviceUrl,
    serviceType: service.title,
    provider: { "@id": absoluteUrl("/#person") },
    category: service.capabilities,
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <ConversionTracker
        eventName="service_view"
        label={service.slug}
        metadata={{ serviceSlug: service.slug }}
      />
      <section className="page-hero">
        <div className="container-shell">
          <Link
            href="/services"
            className="text-link mb-6 inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={15} /> All services
          </Link>
          <p className="eyebrow">Service</p>
          <h1 className="page-title max-w-3xl">{service.title}</h1>
          <p className="section-description max-w-2xl">
            {service.shortDescription}
          </p>
          {service.priceLabel && (
            <p className="mt-4 text-sm font-medium text-teal-400">
              {service.priceLabel}
            </p>
          )}
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <h2 className="text-xl font-semibold text-white">
                What this service covers
              </h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-zinc-400">
                {service.description.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div>
              <div className="surface-card p-6">
                <h3 className="font-semibold text-white">Capabilities</h3>
                <ul className="mt-5 space-y-3">
                  {service.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-start gap-3 text-sm text-zinc-300"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-teal-400"
                      />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              <TrackedLink
                href="/work-with-me"
                className="button button-primary mt-6 w-full justify-center"
                analyticsLabel="service_request"
                analyticsMetadata={{
                  placement: "service_sidebar",
                  serviceSlug: service.slug,
                }}
              >
                Request this service <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-t border-white/10">
        <div className="container-shell">
          <div className="cta-panel">
            <div>
              <p className="eyebrow">Have questions?</p>
              <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Not sure if this is the right fit? Let&apos;s talk through it.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
                I respond to every genuine inquiry. No obligation, no pressure.
              </p>
            </div>
            <TrackedLink
              className="button button-primary shrink-0"
              href="/work-with-me"
              analyticsLabel="service_work_with_me"
              analyticsMetadata={{
                placement: "service_bottom_cta",
                serviceSlug: service.slug,
              }}
            >
              Work with me <ArrowRight size={17} />
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}
