import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { siteConfig } from "@/lib/site";
import { cleanText } from "@/lib/validation";

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return NextResponse.json({ error: "Cross-site form submissions are not accepted." }, { status: 403 });
  }
  const input = await request.json().catch(() => ({}));
  if (cleanText(input.website, 100)) return NextResponse.json({ ok: true }, { status: 201 });

  const name = cleanText(input.name, 100);
  const email = cleanText(input.email, 200).toLowerCase();
  const subject = cleanText(input.subject, 160);
  const message = cleanText(input.message, 5000);
  if (!name || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid name, email, subject, and message." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    return NextResponse.json({ fallback: `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${body}` });
  }

  const { error } = await supabase.from("contact_messages").insert({ name, email, subject, message });
  if (error) return NextResponse.json({ error: "Your message could not be stored. Please email me directly." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
