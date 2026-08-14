import { NextResponse } from "next/server";
import {
  adminAuthConfigured,
  adminCookie,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  if (!verifyAdminPassword(String(body.password || ""))) {
    return NextResponse.json({ error: "The password is not valid." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie.name, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: adminCookie.maxAge,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
