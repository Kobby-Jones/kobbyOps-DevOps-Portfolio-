import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { getPaymentProvider, PaymentConfigurationError } from "@/lib/payments";
import type { PaymentProvider } from "@/lib/payments/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();

  let provider: PaymentProvider;
  try {
    provider = getPaymentProvider();
  } catch (error) {
    const status = error instanceof PaymentConfigurationError ? 503 : 500;
    return NextResponse.json({ error: "Payment webhook is unavailable." }, { status });
  }

  if (!provider.verifyWebhookSignature(rawBody, request.headers)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const event = provider.parseWebhookEvent(rawBody);
  if (event.kind !== "payment.succeeded" || !event.reference) {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Order storage is unavailable." }, { status: 503 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id,amount,currency,status,download_token,download_expires_at")
    .eq("payment_reference", event.reference)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const expectedAmountMinor = Math.round(Number(order.amount) * 100);
  const expectedCurrency = String(order.currency).toUpperCase();
  if (expectedAmountMinor !== event.amountMinor || expectedCurrency !== event.currency) {
    return NextResponse.json({ error: "Payment details do not match the order." }, { status: 409 });
  }

  if (order.status === "paid" && order.download_token) {
    return NextResponse.json({ received: true });
  }

  const downloadToken = randomUUID();
  const downloadExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const eligibleStatuses = order.status === "paid" ? ["paid"] : ["pending", "failed"];
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      download_token: downloadToken,
      download_expires_at: downloadExpiresAt,
      payment_provider: provider.name,
    })
    .eq("id", order.id)
    .in("status", eligibleStatuses);

  if (updateError) {
    return NextResponse.json({ error: "Order confirmation failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
