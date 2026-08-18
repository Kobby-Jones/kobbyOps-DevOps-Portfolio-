import { PaystackProvider } from "./paystack";
import type { PaymentProvider } from "./types";

export class PaymentConfigurationError extends Error {}

export function paymentConfiguration() {
  return {
    secretKey: process.env.PAYMENT_SECRET_KEY || "",
    publicKey: process.env.PAYMENT_PUBLIC_KEY || "",
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "",
  };
}

export function getPaymentProvider(): PaymentProvider {
  const { secretKey, webhookSecret } = paymentConfiguration();
  if (!secretKey || !webhookSecret) {
    throw new PaymentConfigurationError("Payment provider is not configured.");
  }

  return new PaystackProvider(secretKey, webhookSecret);
}
