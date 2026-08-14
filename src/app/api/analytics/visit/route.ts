import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

function referrerHost(value: string) {
  if (!value) return null;
  try { return new URL(value).hostname.slice(0, 200); } catch { return null; }
}

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return NextResponse.json({ error: "Cross-site analytics requests are not accepted." }, { status: 403 });
  }
  const userAgent = request.headers.get("user-agent") || "";
  if (/bot|crawler|spider|preview|lighthouse/i.test(userAgent)) {
    return new NextResponse(null, { status: 204 });
  }

  const input = await request.json().catch(() => ({}));
  const path = typeof input.path === "string" ? input.path.slice(0, 500) : "";
  const visitorId = typeof input.visitorId === "string" ? input.visitorId.slice(0, 200) : "";
  if (!path.startsWith("/") || !visitorId) {
    return NextResponse.json({ error: "Invalid visit." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) return new NextResponse(null, { status: 204 });

  const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_SESSION_SECRET || "kobbyops";
  const visitorHash = createHash("sha256").update(`${salt}:${visitorId}`).digest("hex");
  const { error } = await supabase.from("site_events").insert({
    path,
    visitor_hash: visitorHash,
    referrer_host: referrerHost(typeof input.referrer === "string" ? input.referrer : ""),
  });

  if (error) return NextResponse.json({ error: "Visit was not recorded." }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
