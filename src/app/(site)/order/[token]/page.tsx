import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Download } from "lucide-react";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { evaluateDownloadAccess, isValidDownloadToken } from "@/lib/download-access.mjs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Purchase confirmed",
  robots: { index: false, follow: false, nocache: true },
};

type Props = { params: Promise<{ token: string }> };

type ResourceRelation = { title?: string } | { title?: string }[] | null;

function resourceTitle(resource: ResourceRelation) {
  if (Array.isArray(resource)) return resource[0]?.title || "your resource";
  return resource?.title || "your resource";
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { token } = await params;
  const supabase = createAdminSupabaseClient();
  if (!supabase || !token || !isValidDownloadToken(token)) notFound();

  const { data: order, error } = await supabase
    .from("orders")
    .select("status,download_expires_at,resource:resources(title)")
    .eq("download_token", token)
    .maybeSingle();

  if (error || !order || order.status !== "paid") notFound();

  const access = evaluateDownloadAccess({
    status: order.status,
    downloadExpiresAt: order.download_expires_at,
  });
  const expired = access !== "allowed";
  const title = resourceTitle(order.resource as ResourceRelation);

  return (
    <section className="page-hero min-h-[65vh]">
      <div className="container-shell">
        <div className="surface-card mx-auto max-w-2xl p-8 md:p-10">
          <CheckCircle2 size={34} className="text-emerald-400" />
          <p className="eyebrow mt-6">Order confirmed</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Your purchase of {title} is confirmed.
          </h1>
          {expired ? (
            <p className="mt-5 text-sm leading-7 text-zinc-400">
              This download link has expired. Please contact support if you need help accessing your purchase.
            </p>
          ) : (
            <>
              <p className="mt-5 text-sm leading-7 text-zinc-400">
                Your secure download link is active for 48 hours from payment confirmation.
              </p>
              <a className="button button-primary mt-7 inline-flex" href={`/api/download/${encodeURIComponent(token)}`}>
                Download purchase <Download size={16} />
              </a>
            </>
          )}
          <div className="mt-8 border-t border-white/10 pt-6">
            <Link className="text-link text-sm" href="/resources">Back to resources</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
