import nextEnv from "@next/env";
import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (!value.startsWith("--")) return pairs;
    pairs.push([value.slice(2), all[index + 1] && !all[index + 1].startsWith("--") ? all[index + 1] : "true"]);
    return pairs;
  }, []),
);

const assetTypes = new Set(["resource_file", "resource_thumbnail", "blog_image", "insight_image", "general_image"]);
const prefixes = {
  resource_file: "resource-files",
  resource_thumbnail: "resource-thumbnails",
  blog_image: "blog-images",
  insight_image: "insight-images",
  general_image: "general-media",
};

if (!args.file || !args.type || !assetTypes.has(args.type)) {
  console.error("Usage: npm run asset:upload -- --file \"./path/file.pdf\" --type resource_file [--name \"Display name\"] [--alt \"Alt text\"]");
  process.exit(1);
}

const required = [
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_RESOURCE_BUCKET",
  "AWS_S3_MEDIA_BUCKET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];
const missing = required.filter((name) => !String(process.env[name] || "").trim());
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const filePath = path.resolve(args.file);
const filename = path.basename(filePath);
const sizeBytes = statSync(filePath).size;
const maxMb = Math.max(1, Number(process.env.AWS_S3_UPLOAD_MAX_MB) || 250);
if (sizeBytes > maxMb * 1024 * 1024) {
  console.error(`File exceeds the ${maxMb} MB upload limit.`);
  process.exit(1);
}
const extension = path.extname(filename).toLowerCase();
const mimeByExtension = {
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".csv": "text/csv",
  ".txt": "text/plain",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};
const mimeType = mimeByExtension[extension] || "application/octet-stream";
const date = new Date();
const month = String(date.getUTCMonth() + 1).padStart(2, "0");
const key = `${prefixes[args.type]}/${date.getUTCFullYear()}/${month}/${randomUUID()}${extension}`;
const bucket = args.type === "resource_file" ? process.env.AWS_S3_RESOURCE_BUCKET : process.env.AWS_S3_MEDIA_BUCKET;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {}),
  },
});

await s3.send(new PutObjectCommand({
  Bucket: bucket,
  Key: key,
  Body: createReadStream(filePath),
  ContentLength: sizeBytes,
  ContentType: mimeType,
  Metadata: {
    "original-filename": encodeURIComponent(filename).slice(0, 900),
    "asset-type": args.type,
  },
}));

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data, error } = await supabase
  .from("media_assets")
  .upsert({
    asset_type: args.type,
    display_name: args.name || filename,
    original_filename: filename,
    bucket,
    s3_key: key,
    mime_type: mimeType,
    size_bytes: sizeBytes,
    alt_text: args.alt || null,
    caption: args.caption || null,
    status: "active",
  }, { onConflict: "bucket,s3_key" })
  .select("id,display_name")
  .single();

if (error) {
  console.error(`S3 upload succeeded at s3://${bucket}/${key}, but catalog registration failed: ${error.message}`);
  process.exit(1);
}

console.log(`Uploaded: ${data.display_name}`);
console.log(`Asset ID: ${data.id}`);
console.log(`S3 URI: s3://${bucket}/${key}`);
