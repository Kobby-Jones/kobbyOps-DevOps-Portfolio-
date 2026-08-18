/**
 * Evaluate whether an order currently authorizes a paid download.
 * @param {{ status?: string | null, downloadExpiresAt?: string | null }} input
 * @param {number} [now]
 * @returns {"allowed" | "unauthorized" | "expired"}
 */
export function evaluateDownloadAccess(input, now = Date.now()) {
  if (input.status !== "paid") return "unauthorized";

  const expiresAt = input.downloadExpiresAt
    ? new Date(input.downloadExpiresAt).getTime()
    : 0;

  if (!Number.isFinite(expiresAt) || !expiresAt || expiresAt <= now) return "expired";
  return "allowed";
}

/** @param {string} token */
export function isValidDownloadToken(token) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token);
}
