import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { siteConfig } from "@/lib/site";
import { cleanText, parseConsultationPayload } from "@/lib/validation";

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return NextResponse.json({ error: "Cross-site submissions are not accepted." }, { status: 403 });
  }

  const input = await request.json().catch(() => ({}));

  // Honeypot field
  if (cleanText(input.website, 100) && !cleanText(input.websiteUrl, 100)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    const payload = parseConsultationPayload(input as Record<string, unknown>);

    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\nOrganization: ${payload.organization || "N/A"}\nService: ${payload.service_requested}\nTimeline: ${payload.timeline || "N/A"}\nBudget: ${payload.budget_range || "N/A"}\n\n${payload.project_description}`,
      );
      return NextResponse.json({
        fallback: `mailto:${siteConfig.email}?subject=${encodeURIComponent("Consultation Request")}&body=${body}`,
      });
    }

    const { error } = await supabase.from("consultation_requests").insert(payload);
    if (error) {
      return NextResponse.json(
        { error: "Your request could not be submitted. Please email me directly." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid submission." },
      { status: 400 },
    );
  }
}
