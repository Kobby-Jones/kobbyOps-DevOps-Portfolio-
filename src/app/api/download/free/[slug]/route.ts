import { createAdminSupabaseClient } from "@/lib/supabase";
import { proxyFileDownload } from "@/lib/resource-download";

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
    .select("id,title,type,status,file_url")
    .eq("slug", slug)
    .single();

  if (
    error ||
    !resource ||
    resource.status !== "published" ||
    resource.type !== "free_resource" ||
    !resource.file_url
  ) {
    return new Response("Resource file not found.", { status: 404 });
  }

  const response = await proxyFileDownload(String(resource.file_url), String(resource.title));
  if (response.ok) {
    await supabase.rpc("increment_resource_download_count", { p_resource_id: resource.id });
  }
  return response;
}
