import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { streamS3Asset } from "@/lib/resource-download";

const MEDIA_TYPES = new Set(["resource_thumbnail", "blog_image", "insight_image", "general_image"]);

type Props = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Not found.", { status: 404 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return new NextResponse("Media unavailable.", { status: 503 });

  const { data: asset, error } = await supabase
    .from("media_assets")
    .select("id,asset_type,display_name,original_filename,bucket,s3_key,mime_type,status")
    .eq("id", id)
    .single();

  if (error || !asset || asset.status !== "active" || !MEDIA_TYPES.has(String(asset.asset_type))) {
    return new NextResponse("Not found.", { status: 404 });
  }

  return streamS3Asset(asset, String(asset.display_name), "inline");
}
