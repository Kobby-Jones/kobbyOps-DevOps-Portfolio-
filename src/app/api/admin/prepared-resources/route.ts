import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { cleanText } from "@/lib/validation";

const TYPES = new Set(["free_resource", "paid_product"]);
const CATEGORIES = new Set(["aws", "docker", "devops", "kubernetes", "backend", "ci_cd", "career", "engineering"]);

const unauthorized = () => NextResponse.json({ error: "Unauthorized." }, { status: 401 });
const unavailable = () => NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

async function withAssets(supabase: NonNullable<ReturnType<typeof createAdminSupabaseClient>>) {
  const [{ data: prepared, error }, { data: assets, error: assetsError }] = await Promise.all([
    supabase.from("prepared_resources").select("*").order("updated_at", { ascending: false }),
    supabase.from("media_assets").select("*").eq("status", "active"),
  ]);
  if (error) throw new Error(error.message);
  if (assetsError) throw new Error(assetsError.message);

  const assetMap = new Map((assets || []).map((asset) => [asset.id, asset]));
  return (prepared || []).map((item) => ({
    ...item,
    file_asset: item.file_asset_id ? assetMap.get(item.file_asset_id) || null : null,
    thumbnail_asset: item.thumbnail_asset_id ? assetMap.get(item.thumbnail_asset_id) || null : null,
  }));
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();
  try {
    return NextResponse.json({ items: await withAssets(supabase) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load prepared resources." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  try {
    const input = (await request.json()) as Record<string, unknown>;
    const id = cleanText(input.id, 80) || undefined;
    const name = cleanText(input.name, 240);
    const defaultType = cleanText(input.defaultType, 30);
    const defaultCategory = cleanText(input.defaultCategory, 30);
    const fileAssetId = cleanText(input.fileAssetId, 80) || null;
    const thumbnailAssetId = cleanText(input.thumbnailAssetId, 80) || null;
    const externalUrl = cleanText(input.externalUrl, 1000) || null;

    if (!name) throw new Error("Prepared resource name is required.");
    if (!TYPES.has(defaultType)) throw new Error("Payment type must be free or paid.");
    if (!CATEGORIES.has(defaultCategory)) throw new Error("Select a valid resource category.");
    if (!fileAssetId && !externalUrl) throw new Error("Choose a resource file or provide an external URL.");
    if (externalUrl) {
      const parsed = new URL(externalUrl);
      if (parsed.protocol !== "https:") throw new Error("External URL must use HTTPS.");
    }

    if (fileAssetId) {
      const { data: fileAsset, error: fileError } = await supabase
        .from("media_assets")
        .select("id,asset_type,status")
        .eq("id", fileAssetId)
        .single();
      if (fileError || !fileAsset || fileAsset.status !== "active" || fileAsset.asset_type !== "resource_file") {
        throw new Error("Select a valid active S3 resource file.");
      }
    }
    if (thumbnailAssetId) {
      const { data: thumbnail, error: thumbnailError } = await supabase
        .from("media_assets")
        .select("id,asset_type,status")
        .eq("id", thumbnailAssetId)
        .single();
      if (thumbnailError || !thumbnail || thumbnail.status !== "active" || thumbnail.asset_type === "resource_file") {
        throw new Error("Select a valid active S3 image for the thumbnail.");
      }
    }

    const values = {
      name,
      file_asset_id: fileAssetId,
      thumbnail_asset_id: thumbnailAssetId,
      external_url: externalUrl,
      default_type: defaultType,
      default_price: defaultType === "paid_product" ? Math.max(0, Number(input.defaultPrice) || 0) : 0,
      default_currency: cleanText(input.defaultCurrency, 10) || "GHS",
      default_category: defaultCategory,
      notes: cleanText(input.notes, 3000) || null,
      status: cleanText(input.status, 20) === "archived" ? "archived" : cleanText(input.status, 20) === "draft" ? "draft" : "ready",
    };

    const result = id
      ? await supabase.from("prepared_resources").update(values).eq("id", id).select("*").single()
      : await supabase.from("prepared_resources").insert(values).select("*").single();

    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json({ item: result.data }, { status: id ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save the prepared resource." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Prepared resource ID is required." }, { status: 400 });

  const { count } = await supabase
    .from("resources")
    .select("id", { count: "exact", head: true })
    .eq("prepared_resource_id", id);
  if ((count || 0) > 0) {
    return NextResponse.json({ error: "This prepared resource is already used by a published/draft resource. Archive it instead." }, { status: 409 });
  }

  const { error } = await supabase.from("prepared_resources").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
