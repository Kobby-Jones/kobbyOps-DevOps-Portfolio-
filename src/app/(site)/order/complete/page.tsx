import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Confirming payment",
  robots: { index: false, follow: false, nocache: true },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrderCompletePage({ searchParams }: Props) {
  const query = await searchParams;
  const rawReference = query.reference ?? query.trxref;
  const reference = Array.isArray(rawReference) ? rawReference[0] : rawReference;
  const supabase = createAdminSupabaseClient();

  if (reference && supabase) {
    const { data: order } = await supabase
      .from("orders")
      .select("status,download_token")
      .eq("payment_reference", reference)
      .maybeSingle();

    if (order?.status === "paid" && order.download_token) {
      redirect(`/order/${order.download_token}`);
    }
  }

  return (
    <section className="page-hero min-h-[60vh]">
      <div className="container-shell">
        <div className="surface-card mx-auto max-w-xl p-8 text-center">
          <LoaderCircle className="mx-auto animate-spin text-teal-400" size={30} />
          <p className="eyebrow mt-6">Payment verification</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Your payment is being confirmed.</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            The payment provider webhook is the authoritative confirmation. If verification is still processing, use Refresh status to check again.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a className="button button-primary" href={reference ? `/order/complete?reference=${encodeURIComponent(reference)}` : "/order/complete"}>
              Refresh status
            </a>
            <Link className="button button-secondary" href="/resources">Back to resources</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
