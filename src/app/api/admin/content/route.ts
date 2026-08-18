import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { parseContentPayload } from "@/lib/validation";

const unauthorized = () => NextResponse.json({ error: "Unauthorized." }, { status: 401 });
const unavailable = () => NextResponse.json({ error: "Supabase publishing is not configured." }, { status: 503 });

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  try {
    const input = await request.json();
    const payload = parseContentPayload(input as Record<string, unknown>);
    const { id, ...parsedValues } = payload;
    const values = { ...parsedValues };

    if (values.cover_asset_id) {
      const { data: cover, error: coverError } = await supabase
        .from("media_assets")
        .select("id,asset_type,status")
        .eq("id", values.cover_asset_id)
        .single();
      if (coverError || !cover || cover.status !== "active" || cover.asset_type === "resource_file") {
        return NextResponse.json({ error: "Select a valid active S3 image for the cover." }, { status: 400 });
      }
      values.cover_url = `/api/media/${cover.id}`;
    }

    const result = id
      ? await supabase.from("content_items").update(values).eq("id", id).select("*").single()
      : await supabase.from("content_items").insert(values).select("*").single();

    if (result.error) {
      const status = result.error.code === "23505" ? 409 : 500;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    revalidatePath("/writing");
    revalidatePath(`/${result.data.type === "blog" ? "blog" : "insights"}`);
    revalidatePath(`/${result.data.type === "blog" ? "blog" : "insights"}/${result.data.slug}`);
    revalidatePath("/feed.xml");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ item: result.data }, { status: id ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid content payload." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Content ID is required." }, { status: 400 });

  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
