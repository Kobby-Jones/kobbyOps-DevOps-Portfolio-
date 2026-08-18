import { slugify } from "./validation";
import { getAssetObject } from "./s3-assets";

type S3DownloadAsset = {
  bucket: string;
  s3_key: string;
  original_filename?: string | null;
  mime_type?: string | null;
};

function safeExtension(fileUrl: string) {
  try {
    const pathname = new URL(fileUrl).pathname;
    const match = pathname.match(/(\.[a-z0-9]{1,10})$/i);
    return match?.[1] || "";
  } catch {
    return "";
  }
}

function safeFilename(value: string) {
  return value.replace(/["\\\r\n]/g, "-").slice(0, 180) || "download";
}

function objectBodyToWebStream(body: unknown): ReadableStream<Uint8Array> | null {
  if (!body || typeof body !== "object") return null;
  const candidate = body as { transformToWebStream?: () => ReadableStream<Uint8Array> };
  return typeof candidate.transformToWebStream === "function" ? candidate.transformToWebStream() : null;
}

export function isAllowedFileUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function proxyFileDownload(fileUrl: string, title: string) {
  if (!isAllowedFileUrl(fileUrl)) {
    return new Response("The resource file is not available.", { status: 502 });
  }

  const upstream = await fetch(fileUrl, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
  }).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    return new Response("The resource file could not be retrieved.", { status: 502 });
  }

  const headers = new Headers({
    "Cache-Control": "private, no-store, max-age=0",
    "Content-Disposition": `attachment; filename="${slugify(title) || "download"}${safeExtension(fileUrl)}"`,
    "X-Content-Type-Options": "nosniff",
  });

  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  return new Response(upstream.body, { status: 200, headers });
}

export async function streamS3Asset(
  asset: S3DownloadAsset,
  title: string,
  disposition: "attachment" | "inline" = "attachment",
) {
  try {
    const object = await getAssetObject(asset.bucket, asset.s3_key);
    const stream = objectBodyToWebStream(object.Body);
    if (!stream) return new Response("The S3 object could not be streamed.", { status: 502 });

    const filename = safeFilename(asset.original_filename || slugify(title) || "download");
    const headers = new Headers({
      "Cache-Control": disposition === "inline" ? "public, max-age=3600" : "private, no-store, max-age=0",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
    });
    const contentType = object.ContentType || asset.mime_type;
    if (contentType) headers.set("Content-Type", contentType);
    if (object.ContentLength != null) headers.set("Content-Length", String(object.ContentLength));
    if (object.ETag) headers.set("ETag", object.ETag);

    return new Response(stream, { status: 200, headers });
  } catch {
    return new Response("The S3 object could not be retrieved.", { status: 502 });
  }
}
