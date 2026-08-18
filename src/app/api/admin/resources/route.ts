import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { parseResourcePayload } from "@/lib/validation";
import { revalidatePath } from "next/cache";

const unauthorized = () => NextResponse.json({ error: "Unauthorized." }, { status: 401 });
const unavailable = () => NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  const { data, error } = await supabase
    .from("resources")
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
    const payload = parseResourcePayload(input as Record<string, unknown>);
    const { id, ...parsedValues } = payload;
    const values = { ...parsedValues };

    if (values.file_asset_id) {
      const { data: fileAsset, error: fileAssetError } = await supabase
        .from("media_assets")
        .select("id,asset_type,status")
        .eq("id", values.file_asset_id)
        .single();
      if (fileAssetError || !fileAsset || fileAsset.status !== "active" || fileAsset.asset_type !== "resource_file") {
        return NextResponse.json({ error: "Select a valid active S3 resource file." }, { status: 400 });
      }
      values.file_url = null;
    }

    if (values.thumbnail_asset_id) {
      const { data: thumbnail, error: thumbnailError } = await supabase
        .from("media_assets")
        .select("id,asset_type,status")
        .eq("id", values.thumbnail_asset_id)
        .single();
      if (thumbnailError || !thumbnail || thumbnail.status !== "active" || thumbnail.asset_type === "resource_file") {
        return NextResponse.json({ error: "Select a valid active S3 image for the thumbnail." }, { status: 400 });
      }
      values.thumbnail_url = `/api/media/${thumbnail.id}`;
    }

    values.has_download = Boolean(values.file_asset_id || values.file_url);
    if (values.type === "paid_product" && !values.has_download) {
      return NextResponse.json({ error: "Paid products require an S3 resource file or legacy HTTPS file URL." }, { status: 400 });
    }
    if (values.type === "free_resource" && !values.has_download && !values.external_url) {
      return NextResponse.json({ error: "Free resources require an S3 file, legacy file URL, or external URL." }, { status: 400 });
    }

    const result = id
      ? await supabase.from("resources").update(values).eq("id", id).select("*").single()
      : await supabase.from("resources").insert(values).select("*").single();

    if (result.error) {
      const status = result.error.code === "23505" ? 409 : 500;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    revalidatePath("/resources");

    if (result.data?.slug) {
      revalidatePath(`/resources/${result.data.slug}`);
    }

    revalidatePath("/sitemap.xml");
    revalidatePath("/feed.xml");

    return NextResponse.json({ item: result.data }, { status: id ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid resource payload." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Resource ID is required." }, { status: 400 });

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/resources");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  
  return NextResponse.json({ ok: true });
}
