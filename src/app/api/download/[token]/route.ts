import { createAdminSupabaseClient } from "@/lib/supabase";
import { evaluateDownloadAccess, isValidDownloadToken } from "@/lib/download-access.mjs";
import { proxyFileDownload, streamS3Asset } from "@/lib/resource-download";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { token } = await params;
  if (!token || !isValidDownloadToken(token)) {
    return new Response("Download not found.", { status: 404 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) return new Response("Download service unavailable.", { status: 503 });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id,resource_id,status,download_expires_at")
    .eq("download_token", token)
    .maybeSingle();

  if (orderError || !order) return new Response("Download not found.", { status: 404 });

  const access = evaluateDownloadAccess({
    status: order.status,
    downloadExpiresAt: order.download_expires_at,
  });
  if (access === "unauthorized") {
    return new Response("Download is not authorized.", { status: 403 });
  }
  if (access === "expired") {
    return new Response("This download link has expired.", { status: 403 });
  }

  const { data: resource, error: resourceError } = await supabase
    .from("resources")
    .select("id,title,file_url,file_asset_id,status")
    .eq("id", order.resource_id)
    .single();

  if (
    resourceError ||
    !resource ||
    resource.status !== "published" ||
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
