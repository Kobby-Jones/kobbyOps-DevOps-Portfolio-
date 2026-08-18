import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { getPaymentProvider, PaymentConfigurationError } from "@/lib/payments";
import type { PaymentProvider } from "@/lib/payments/types";
import { parseCheckoutPayload } from "@/lib/validation";
import { isAllowedFileUrl } from "@/lib/resource-download";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Checkout is unavailable." }, { status: 503 });
  }

  try {
    const input = await request.json();
    const { resourceId, customerName, customerEmail } = parseCheckoutPayload(
      input as Record<string, unknown>,
    );

    const { data: resource, error: resourceError } = await supabase
      .from("resources")
      .select("id,title,slug,type,price,currency,status,file_url,file_asset_id")
      .eq("id", resourceId)
      .single();

    if (resourceError || !resource || resource.status !== "published") {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }
    if (resource.type !== "paid_product" || Number(resource.price) <= 0) {
      return NextResponse.json({ error: "This resource does not require checkout." }, { status: 400 });
    }
    const hasS3File = Boolean(resource.file_asset_id);
    const hasLegacyFile = Boolean(resource.file_url && isAllowedFileUrl(String(resource.file_url)));
    if (!hasS3File && !hasLegacyFile) {
      return NextResponse.json({ error: "This product is not available for purchase." }, { status: 409 });
    }

    let provider: PaymentProvider;
    try {
      provider = getPaymentProvider();
    } catch (error) {
      if (error instanceof PaymentConfigurationError) {
        return NextResponse.json({ error: "Checkout is not configured." }, { status: 503 });
      }
      throw error;
    }

    const amount = Number(resource.price);
    const currency = String(resource.currency || "USD").toUpperCase();
    const amountMinor = Math.round(amount * 100);
    const paymentReference = `order_${randomUUID().replaceAll("-", "")}`;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_email: customerEmail,
        customer_name: customerName,
        resource_id: resource.id,
        amount,
        currency,
        status: "pending",
        payment_reference: paymentReference,
        payment_provider: provider.name,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order could not be created." }, { status: 500 });
    }

    try {
      const session = await provider.initializeCheckout({
        email: customerEmail,
        customerName,
        amountMinor,
        currency,
        reference: paymentReference,
        callbackUrl: new URL(`/order/complete?reference=${encodeURIComponent(paymentReference)}`, request.url).toString(),
        metadata: {
          order_id: String(order.id),
          resource_id: String(resource.id),
          resource_slug: String(resource.slug),
        },
      });

      if (session.reference !== paymentReference) {
        await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
        return NextResponse.json({ error: "Payment provider returned an invalid reference." }, { status: 502 });
      }

      return NextResponse.json(
        { paymentUrl: session.authorizationUrl },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (error) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Payment initialization failed." },
        { status: 502 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid checkout request." },
      { status: 400 },
    );
  }
}
