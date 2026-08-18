export function evaluateDownloadAccess(
  input: { status?: string | null; downloadExpiresAt?: string | null },
  now?: number,
): "allowed" | "unauthorized" | "expired";
export function isValidDownloadToken(token: string): boolean;
