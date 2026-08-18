import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase";
import {
  inferAssetTypeFromKey,
  isS3Configured,
  listBucketObjects,
  headAsset,
} from "@/lib/s3-assets";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isS3Configured()) {
    return NextResponse.json({ error: "AWS S3 is not configured." }, { status: 503 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const buckets = [process.env.AWS_S3_RESOURCE_BUCKET!, process.env.AWS_S3_MEDIA_BUCKET!];
  const { data: existing, error: existingError } = await supabase
    .from("media_assets")
    .select("bucket,s3_key");
  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });

  const known = new Set((existing || []).map((item) => `${item.bucket}\n${item.s3_key}`));
  const discovered: Record<string, unknown>[] = [];

  for (const bucket of buckets) {
    const objects = await listBucketObjects(bucket);
    for (const object of objects) {
      const key = object.Key;
      if (!key || key.endsWith("/") || known.has(`${bucket}\n${key}`)) continue;
      const assetType = inferAssetTypeFromKey(bucket, key);
      if (!assetType) continue;

      const head = await headAsset(bucket, key).catch(() => null);
      const encodedName = head?.Metadata?.["original-filename"];
      let originalFilename = key.split("/").pop() || key;
      if (encodedName) {
        try { originalFilename = decodeURIComponent(encodedName); } catch { originalFilename = encodedName; }
      }

      discovered.push({
        asset_type: assetType,
        display_name: originalFilename,
        original_filename: originalFilename,
        bucket,
        s3_key: key,
        mime_type: head?.ContentType || "application/octet-stream",
        size_bytes: Number(head?.ContentLength || object.Size || 0),
        etag: head?.ETag || object.ETag || null,
        status: "active",
      });
    }
  }

  if (discovered.length > 0) {
    const { error } = await supabase
      .from("media_assets")
      .upsert(discovered, { onConflict: "bucket,s3_key", ignoreDuplicates: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ added: discovered.length });
}
