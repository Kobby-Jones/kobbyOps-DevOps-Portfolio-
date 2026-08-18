import { slugify } from "./validation";

function safeExtension(fileUrl: string) {
  try {
    const pathname = new URL(fileUrl).pathname;
    const match = pathname.match(/(\.[a-z0-9]{1,10})$/i);
    return match?.[1] || "";
  } catch {
    return "";
  }
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
