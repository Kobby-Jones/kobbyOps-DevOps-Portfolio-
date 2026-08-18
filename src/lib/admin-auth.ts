import { createSignedSessionToken, safeStringEqual, verifySignedSessionToken } from "./admin-session.mjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "kobbyops_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  return expected.length > 0 && safeStringEqual(password, expected);
}

export function createAdminSessionToken() {
  return createSignedSessionToken(secret(), Date.now() / 1000, SESSION_SECONDS);
}

export function verifyAdminSessionToken(token?: string) {
  return verifySignedSessionToken(token, secret(), Date.now() / 1000);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_SECONDS,
};
