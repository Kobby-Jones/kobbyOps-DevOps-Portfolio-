export function safeStringEqual(left: string, right: string): boolean;
export function createSignedSessionToken(secret: string, nowSeconds: number, lifetimeSeconds: number): string;
export function verifySignedSessionToken(token: string | undefined, secret: string, nowSeconds: number): boolean;
