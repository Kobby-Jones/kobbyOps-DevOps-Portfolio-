export type PaymentCheckoutInput = {
  email: string;
  customerName: string;
  amountMinor: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
};

export type PaymentSession = {
  authorizationUrl: string;
  reference: string;
};

export type PaymentWebhookEvent = {
  kind: "payment.succeeded" | "ignored";
  reference?: string;
  amountMinor?: number;
  currency?: string;
  status?: string;
};

export interface PaymentProvider {
  readonly name: string;
  initializeCheckout(input: PaymentCheckoutInput): Promise<PaymentSession>;
  verifyWebhookSignature(rawBody: string, headers: Headers): boolean;
  parseWebhookEvent(rawBody: string): PaymentWebhookEvent;
}
