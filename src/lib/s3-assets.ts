import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  type GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

export const ASSET_TYPES = [
  "resource_file",
  "resource_thumbnail",
  "blog_image",
  "insight_image",
  "general_image",
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

const IMAGE_TYPES = new Set<AssetType>([
  "resource_thumbnail",
  "blog_image",
  "insight_image",
  "general_image",
]);

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const RESOURCE_MIME_TYPES = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/csv",
  "text/plain",
  "text/markdown",
  "application/json",
  "application/octet-stream",
]);

const PREFIXES: Record<AssetType, string> = {
  resource_file: "resource-files",
  resource_thumbnail: "resource-thumbnails",
  blog_image: "blog-images",
  insight_image: "insight-images",
  general_image: "general-media",
};

let client: S3Client | null = null;

export function isS3Configured() {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_RESOURCE_BUCKET &&
      process.env.AWS_S3_MEDIA_BUCKET,
  );
}

export function getS3Client() {
  if (!isS3Configured()) return null;
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        ...(process.env.AWS_SESSION_TOKEN
          ? { sessionToken: process.env.AWS_SESSION_TOKEN }
          : {}),
      },
    });
  }
  return client;
}

export function isImageAsset(type: AssetType) {
  return IMAGE_TYPES.has(type);
}

export function bucketForAssetType(type: AssetType) {
  return type === "resource_file"
    ? process.env.AWS_S3_RESOURCE_BUCKET || ""
    : process.env.AWS_S3_MEDIA_BUCKET || "";
}

export function prefixForAssetType(type: AssetType) {
  return PREFIXES[type];
}

export function validateAssetUpload(input: {
  assetType: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}) {
  if (!ASSET_TYPES.includes(input.assetType as AssetType)) {
    throw new Error("Unsupported asset type.");
  }

  const assetType = input.assetType as AssetType;
  const filename = input.filename.trim().slice(0, 240);
  const contentType = input.contentType.trim().toLowerCase();
  const sizeBytes = Number(input.sizeBytes);
  const maxMb = Math.max(1, Number(process.env.AWS_S3_UPLOAD_MAX_MB) || 250);

  if (!filename) throw new Error("Filename is required.");
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) throw new Error("File size is invalid.");
  if (sizeBytes > maxMb * 1024 * 1024) {
    throw new Error(`File exceeds the ${maxMb} MB upload limit.`);
  }

  if (isImageAsset(assetType)) {
    if (!IMAGE_MIME_TYPES.has(contentType)) {
      throw new Error("Images must be JPEG, PNG, WebP, or GIF.");
    }
  } else if (!RESOURCE_MIME_TYPES.has(contentType)) {
    throw new Error("Unsupported resource file type.");
  }

  return { assetType, filename, contentType, sizeBytes };
}

function safeExtension(filename: string) {
  const match = filename.toLowerCase().match(/\.([a-z0-9]{1,10})$/);
  return match ? `.${match[1]}` : "";
}

export function buildAssetKey(assetType: AssetType, filename: string) {
  const date = new Date();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${prefixForAssetType(assetType)}/${date.getUTCFullYear()}/${month}/${randomUUID()}${safeExtension(filename)}`;
}

export async function createPresignedUpload(input: {
  assetType: AssetType;
  filename: string;
  contentType: string;
}) {
  const s3 = getS3Client();
  if (!s3) throw new Error("AWS S3 is not configured.");

  const bucket = bucketForAssetType(input.assetType);
  const key = buildAssetKey(input.assetType, input.filename);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: input.contentType,
    Metadata: {
      "original-filename": encodeURIComponent(input.filename).slice(0, 900),
      "asset-type": input.assetType,
    },
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
  return { uploadUrl, bucket, key, expiresIn: 600 };
}

export async function headAsset(bucket: string, key: string) {
  const s3 = getS3Client();
  if (!s3) throw new Error("AWS S3 is not configured.");
  return s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
}

export async function getAssetObject(bucket: string, key: string): Promise<GetObjectCommandOutput> {
  const s3 = getS3Client();
  if (!s3) throw new Error("AWS S3 is not configured.");
  return s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
}

export async function listBucketObjects(bucket: string, prefix?: string) {
  const s3 = getS3Client();
  if (!s3) throw new Error("AWS S3 is not configured.");

  const objects: { Key?: string; Size?: number; ETag?: string; LastModified?: Date }[] = [];
  let continuationToken: string | undefined;
  do {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      }),
    );
    objects.push(...(response.Contents || []));
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return objects;
}

export function inferAssetTypeFromKey(bucket: string, key: string): AssetType | null {
  if (bucket === process.env.AWS_S3_RESOURCE_BUCKET && key.startsWith("resource-files/")) {
    return "resource_file";
  }
  if (bucket !== process.env.AWS_S3_MEDIA_BUCKET) return null;
  if (key.startsWith("resource-thumbnails/")) return "resource_thumbnail";
  if (key.startsWith("blog-images/")) return "blog_image";
  if (key.startsWith("insight-images/")) return "insight_image";
  if (key.startsWith("general-media/")) return "general_image";
  return null;
}

export function storageUri(bucket: string, key: string) {
  return `s3://${bucket}/${key}`;
}
