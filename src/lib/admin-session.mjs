import { createHmac, timingSafeEqual } from "node:crypto";

/** @param {string} left @param {string} right */
export function safeStringEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

/** @param {string} secret @param {number} nowSeconds @param {number} lifetimeSeconds */
export function createSignedSessionToken(secret, nowSeconds, lifetimeSeconds) {
  if (!secret) throw new Error("Session secret is required.");
  const expires = String(Math.floor(nowSeconds) + lifetimeSeconds);
  const signature = createHmac("sha256", secret).update(expires).digest("hex");
  return `${expires}.${signature}`;
}

/** @param {string | undefined} token @param {string} secret @param {number} nowSeconds */
export function verifySignedSessionToken(token, secret, nowSeconds) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expires, signature] = parts;
  const expiresNumber = Number(expires);
  if (!expires || !signature || !Number.isFinite(expiresNumber) || expiresNumber < Math.floor(nowSeconds)) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(expires).digest("hex");
  return safeStringEqual(signature, expected);
}
