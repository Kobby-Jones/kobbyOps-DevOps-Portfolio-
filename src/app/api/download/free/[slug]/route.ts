import { createAdminSupabaseClient } from "@/lib/supabase";
import { proxyFileDownload, streamS3Asset } from "@/lib/resource-download";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  if (!slug || slug.length > 100) return new Response("Resource not found.", { status: 404 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return new Response("Download service unavailable.", { status: 503 });

  const { data: resource, error } = await supabase
    .from("resources")
    .select("id,title,type,status,file_url,file_asset_id")
    .eq("slug", slug)
    .single();

  if (
    error ||
    !resource ||
    resource.status !== "published" ||
    resource.type !== "free_resource" ||
    (!resource.file_asset_id && !resource.file_url)
  ) {
    return new Response("Resource file not found.", { status: 404 });
  }

  let response: Response;
  if (resource.file_asset_id) {
    const { data: asset, error: assetError } = await supabase
      .from("media_assets")
      .select("bucket,s3_key,original_filename,mime_type,status,asset_type")
      .eq("id", resource.file_asset_id)
      .single();
    if (assetError || !asset || asset.status !== "active" || asset.asset_type !== "resource_file") {
      return new Response("Resource file not found.", { status: 404 });
    }
    response = await streamS3Asset(asset, String(resource.title));
  } else {
    response = await proxyFileDownload(String(resource.file_url), String(resource.title));
  }
  if (response.ok) {
    await supabase.rpc("increment_resource_download_count", { p_resource_id: resource.id });
  }
  return response;
}
