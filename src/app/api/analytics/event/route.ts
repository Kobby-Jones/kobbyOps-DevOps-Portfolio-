import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

const ALLOWED_EVENTS = new Set(["service_view", "cta_click", "checkout_initiated"]);
const ALLOWED_METADATA_KEYS = new Set([
  "destination",
  "placement",
  "serviceSlug",
  "resourceSlug",
  "articleSlug",
  "articleType",
]);

function referrerHost(value: string) {
  if (!value) return null;
  try {
    return new URL(value).hostname.slice(0, 200);
  } catch {
    return null;
  }
}

function sanitizeMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const result: Record<string, string | number | boolean | null> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!ALLOWED_METADATA_KEYS.has(key)) continue;
    if (typeof item === "string") result[key] = item.slice(0, 200);
    else if (typeof item === "number" && Number.isFinite(item)) result[key] = item;
    else if (typeof item === "boolean" || item === null) result[key] = item;
  }
  return result;
}

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return NextResponse.json(
      { error: "Cross-site analytics requests are not accepted." },
      { status: 403 },
    );
  }

  const userAgent = request.headers.get("user-agent") || "";
  if (/bot|crawler|spider|preview|lighthouse/i.test(userAgent)) {
    return new NextResponse(null, { status: 204 });
  }

  const input = await request.json().catch(() => ({}));
  const eventName = typeof input.eventName === "string" ? input.eventName : "";
  const path = typeof input.path === "string" ? input.path.slice(0, 500) : "";
  const visitorId = typeof input.visitorId === "string" ? input.visitorId.slice(0, 200) : "";
  const label = typeof input.label === "string" ? input.label.slice(0, 200) : null;

  if (!ALLOWED_EVENTS.has(eventName) || !path.startsWith("/") || !visitorId) {
    return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) return new NextResponse(null, { status: 204 });

  const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_SESSION_SECRET || "kobbyops";
  const visitorHash = createHash("sha256").update(`${salt}:${visitorId}`).digest("hex");

  const { error } = await supabase.from("site_events").insert({
    path,
    visitor_hash: visitorHash,
    referrer_host: referrerHost(typeof input.referrer === "string" ? input.referrer : ""),
    event_name: eventName,
    event_label: label,
    metadata: sanitizeMetadata(input.metadata),
  });

  if (error) {
    return NextResponse.json({ error: "Analytics event was not recorded." }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
