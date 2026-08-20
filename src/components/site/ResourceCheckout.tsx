"use client";

import { LoaderCircle, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { trackAnalyticsEvent } from "@/lib/client-analytics";

export default function ResourceCheckout({
  resourceId,
  resourceSlug,
  displayPrice,
  priceLabel = "Price",
  priceNote,
}: {
  resourceId: string;
  resourceSlug: string;
  displayPrice?: string;
  priceLabel?: string;
  priceNote?: string;
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, customerName, customerEmail }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        paymentUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.paymentUrl) {
        throw new Error(payload.error || "Checkout could not be started.");
      }

      trackAnalyticsEvent("checkout_initiated", {
        label: resourceSlug,
        metadata: { resourceSlug },
      });
      window.location.assign(payload.paymentUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
      setLoading(false);
    }
  }

  return (
    <form className="surface-card overflow-hidden" onSubmit={checkout}>
      {displayPrice ? (
        <div className="resource-checkout-price">
          <p className="resource-product-price-label">{priceLabel}</p>
          <p className="resource-product-price">{displayPrice}</p>
          {priceNote ? <p className="resource-product-price-note">{priceNote}</p> : null}
        </div>
      ) : null}
      <div className="p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <LockKeyhole size={16} className="text-teal-400" /> Secure checkout
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Your payment is confirmed server-side before a time-limited download link is issued.
      </p>
      <label className="form-label mt-5">
        Name
        <input
          className="form-input"
          autoComplete="name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          required
          maxLength={120}
        />
      </label>
      <label className="form-label mt-4">
        Email
        <input
          className="form-input"
          type="email"
          autoComplete="email"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          required
          maxLength={200}
        />
      </label>
      {error ? <p className="mt-4 text-sm text-rose-400" role="alert">{error}</p> : null}
      <button className="button button-primary mt-6 w-full justify-center" type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="animate-spin" size={16} /> : null}
        {loading ? "Opening payment" : "Purchase securely"}
      </button>
      </div>
    </form>
  );
}
