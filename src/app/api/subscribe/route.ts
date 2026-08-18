import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { cleanText } from "@/lib/validation";

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return NextResponse.json({ error: "Cross-site submissions are not accepted." }, { status: 403 });
  }

  const input = await request.json().catch(() => ({}));

  // Honeypot
  if (cleanText(input.company, 100)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const email = cleanText(input.email, 200).toLowerCase();
  const name = cleanText(input.name, 100);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Subscriptions are not available at this time." }, { status: 503 });
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email, name: name || null, status: "active" }, { onConflict: "email" });

  if (error) {
    return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
