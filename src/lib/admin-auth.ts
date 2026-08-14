import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "kobbyops_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(expires: string) {
  return createHmac("sha256", secret()).update(expires).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  return expected.length > 0 && safeEqual(password, expected);
}

export function createAdminSessionToken() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expires}.${sign(expires)}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token || !secret()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(expires));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_SECONDS,
};
