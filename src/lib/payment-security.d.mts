export function verifyHmacSha512(rawBody: string, signature: string | null | undefined, secret: string): boolean;
export function parsePaystackSuccessEvent(rawBody: string):
  | { kind: "payment.succeeded"; reference: string; amountMinor: number; currency: string; status: string }
  | { kind: "ignored" };
