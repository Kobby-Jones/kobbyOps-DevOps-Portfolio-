import { parsePaystackSuccessEvent, verifyHmacSha512 } from "../payment-security.mjs";
import type {
  PaymentCheckoutInput,
  PaymentProvider,
  PaymentSession,
  PaymentWebhookEvent,
} from "./types";

type PaystackInitializeResponse = {
  status?: boolean;
  message?: string;
  data?: {
    authorization_url?: string;
    reference?: string;
  };
};

export class PaystackProvider implements PaymentProvider {
  readonly name = "paystack";

  constructor(
    private readonly secretKey: string,
    private readonly webhookSecret: string,
  ) {}

  async initializeCheckout(input: PaymentCheckoutInput): Promise<PaymentSession> {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amountMinor,
        currency: input.currency,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: {
          ...input.metadata,
          customer_name: input.customerName,
        },
      }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => ({}))) as PaystackInitializeResponse;
    const authorizationUrl = payload.data?.authorization_url;
    const reference = payload.data?.reference;

    if (!response.ok || !payload.status || !authorizationUrl || !reference) {
      throw new Error(payload.message || "Payment session could not be initialized.");
    }

    return { authorizationUrl, reference };
  }

  verifyWebhookSignature(rawBody: string, headers: Headers) {
    return verifyHmacSha512(
      rawBody,
      headers.get("x-paystack-signature"),
      this.webhookSecret,
    );
  }

  parseWebhookEvent(rawBody: string): PaymentWebhookEvent {
    return parsePaystackSuccessEvent(rawBody);
  }
}
