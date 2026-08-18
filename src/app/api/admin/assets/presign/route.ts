import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createPresignedUpload, isS3Configured, validateAssetUpload } from "@/lib/s3-assets";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isS3Configured()) {
    return NextResponse.json({ error: "AWS S3 is not configured." }, { status: 503 });
  }

  try {
    const input = (await request.json()) as Record<string, unknown>;
    const validated = validateAssetUpload({
      assetType: String(input.assetType || ""),
      filename: String(input.filename || ""),
      contentType: String(input.contentType || "application/octet-stream"),
      sizeBytes: Number(input.sizeBytes || 0),
    });
    const result = await createPresignedUpload(validated);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not prepare the S3 upload." },
      { status: 400 },
    );
  }
}
