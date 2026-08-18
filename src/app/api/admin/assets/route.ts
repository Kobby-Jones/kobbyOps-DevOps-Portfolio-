import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase";
import {
  ASSET_TYPES,
  bucketForAssetType,
  headAsset,
  prefixForAssetType,
  type AssetType,
} from "@/lib/s3-assets";
import { cleanText } from "@/lib/validation";

const unauthorized = () => NextResponse.json({ error: "Unauthorized." }, { status: 401 });
const unavailable = () => NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  try {
    const input = (await request.json()) as Record<string, unknown>;
    const assetType = cleanText(input.assetType, 40) as AssetType;
    if (!ASSET_TYPES.includes(assetType)) throw new Error("Unsupported asset type.");

    const bucket = cleanText(input.bucket, 255);
    const s3Key = cleanText(input.s3Key, 1000);
    const originalFilename = cleanText(input.originalFilename, 240);
    const displayName = cleanText(input.displayName, 240) || originalFilename;

    if (!bucket || !s3Key || !originalFilename) {
      throw new Error("Bucket, S3 key, and original filename are required.");
    }
    if (bucket !== bucketForAssetType(assetType)) {
      throw new Error("Asset bucket does not match the selected asset type.");
    }
    if (!s3Key.startsWith(`${prefixForAssetType(assetType)}/`)) {
      throw new Error("S3 object key does not match the selected asset type.");
    }

    const head = await headAsset(bucket, s3Key);
    const values = {
      asset_type: assetType,
      display_name: displayName,
      original_filename: originalFilename,
      bucket,
      s3_key: s3Key,
      mime_type: cleanText(head.ContentType, 200) || cleanText(input.contentType, 200) || "application/octet-stream",
      size_bytes: Number(head.ContentLength || input.sizeBytes || 0),
      etag: cleanText(head.ETag, 200) || null,
      alt_text: cleanText(input.altText, 500) || null,
      caption: cleanText(input.caption, 1000) || null,
      status: "active",
    };

    const { data, error } = await supabase
      .from("media_assets")
      .upsert(values, { onConflict: "bucket,s3_key" })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not register the asset." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  try {
    const input = (await request.json()) as Record<string, unknown>;
    const id = cleanText(input.id, 80);
    if (!id) throw new Error("Asset ID is required.");

    const values = {
      display_name: cleanText(input.displayName, 240),
      alt_text: cleanText(input.altText, 500) || null,
      caption: cleanText(input.caption, 1000) || null,
      status: cleanText(input.status, 20) === "archived" ? "archived" : "active",
    };
    if (!values.display_name) throw new Error("Display name is required.");

    const { data, error } = await supabase
      .from("media_assets")
      .update(values)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update the asset." },
      { status: 400 },
    );
  }
}
