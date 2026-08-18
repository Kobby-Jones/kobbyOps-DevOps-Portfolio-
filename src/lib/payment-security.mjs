import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Compare two hexadecimal digests without leaking timing information.
 * @param {string} left
 * @param {string} right
 */
function safeHexEqual(left, right) {
  if (!/^[a-f0-9]+$/i.test(left) || !/^[a-f0-9]+$/i.test(right)) return false;
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

/**
 * Verify a Paystack-compatible SHA-512 HMAC signature against the exact raw request body.
 * @param {string} rawBody
 * @param {string | null | undefined} signature
 * @param {string} secret
 */
export function verifyHmacSha512(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  return safeHexEqual(signature, expected);
}

/**
 * Normalize a Paystack webhook payload into the provider-neutral success shape.
 * Malformed and non-success events are intentionally ignored.
 * @param {string} rawBody
 * @returns {{ kind: "payment.succeeded", reference: string, amountMinor: number, currency: string, status: string } | { kind: "ignored" }}
 */
export function parsePaystackSuccessEvent(rawBody) {
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { kind: "ignored" };
  }

  if (payload?.event !== "charge.success" || payload?.data?.status !== "success") {
    return { kind: "ignored" };
  }

  const reference = payload.data.reference;
  const amountMinor = Number(payload.data.amount);
  const currency = typeof payload.data.currency === "string"
    ? payload.data.currency.toUpperCase()
    : "";

  if (!reference || !Number.isFinite(amountMinor) || amountMinor < 0 || !currency) {
    return { kind: "ignored" };
  }

  return {
    kind: "payment.succeeded",
    reference,
    amountMinor,
    currency,
    status: payload.data.status,
  };
}
