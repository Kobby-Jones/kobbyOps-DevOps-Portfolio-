import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase";

type EventRow = {
  path: string;
  visitor_hash: string;
  created_at: string;
  event_name: string;
  event_label: string | null;
};

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase analytics is not configured." }, { status: 503 });
  }

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);

  const [allVisitsResult, recentEventsResult, contentResult, messageResult] = await Promise.all([
    supabase
      .from("site_events")
      .select("path,visitor_hash,created_at,event_name,event_label")
      .eq("event_name", "page_view")
      .order("created_at", { ascending: false })
      .limit(10000),
    supabase
      .from("site_events")
      .select("path,visitor_hash,created_at,event_name,event_label")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true })
      .limit(10000),
    supabase.from("content_items").select("status"),
    supabase
      .from("contact_messages")
      .select("id,name,email,subject,message,status,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const firstError = allVisitsResult.error || recentEventsResult.error || contentResult.error || messageResult.error;
  if (firstError) return NextResponse.json({ error: firstError.message }, { status: 500 });

  const allVisits = (allVisitsResult.data || []) as EventRow[];
  const recentEvents = (recentEventsResult.data || []) as EventRow[];
  const recentVisits = recentEvents.filter((event) => event.event_name === "page_view");

  const pageCounts = new Map<string, number>();
  recentVisits.forEach((visit) => pageCounts.set(visit.path, (pageCounts.get(visit.path) || 0) + 1));
  const topPages = [...pageCounts.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const dailyMap = new Map<string, number>();
  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - offset);
    dailyMap.set(date.toISOString().slice(0, 10), 0);
  }
  recentVisits.forEach((visit) => {
    const date = visit.created_at.slice(0, 10);
    if (dailyMap.has(date)) dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
  });

  const serviceViews = recentEvents.filter((event) => event.event_name === "service_view").length;
  const ctaClicks = recentEvents.filter((event) => event.event_name === "cta_click").length;
  const checkoutInitiations = recentEvents.filter((event) => event.event_name === "checkout_initiated").length;
  const recentConversions = recentEvents
    .filter((event) => event.event_name !== "page_view")
    .slice(-20)
    .reverse()
    .map((event) => ({
      eventName: event.event_name,
      label: event.event_label,
      path: event.path,
      createdAt: event.created_at,
    }));

  const content = contentResult.data || [];
  const analytics = {
    totalViews: allVisits.length,
    uniqueVisitors: new Set(allVisits.map((visit) => visit.visitor_hash)).size,
    viewsLast30Days: recentVisits.length,
    messages: messageResult.count || 0,
    published: content.filter((item) => item.status === "published").length,
    drafts: content.filter((item) => item.status === "draft").length,
    serviceViews,
    ctaClicks,
    checkoutInitiations,
    topPages,
    daily: [...dailyMap.entries()].map(([date, views]) => ({ date, views })),
    recentConversions,
    recentMessages: messageResult.data || [],
  };

  return NextResponse.json({ analytics }, { headers: { "Cache-Control": "no-store" } });
}
