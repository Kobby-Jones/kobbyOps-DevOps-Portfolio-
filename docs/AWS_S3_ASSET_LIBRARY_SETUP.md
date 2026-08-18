# AWS S3 Asset Library Setup

This project keeps Amazon S3 as the file-storage layer and Supabase as the application catalog. Both S3 buckets can remain private.

## 1. Create two private S3 buckets

Create both buckets in the same AWS Region as your primary audience where practical. Bucket names must be globally unique. Suggested names:

- `cobbinaemmanuel-private-resources-<unique>` — PDFs, ZIPs, DOCX/XLSX/PPTX, templates and other downloadable files.
- `cobbinaemmanuel-media-<unique>` — resource thumbnails, blog images, insight images and reusable media.

For both buckets:

- Keep **Block all public access** enabled.
- Enable **Bucket Versioning**.
- Keep default S3 server-side encryption enabled.
- Do not add a public-read bucket policy.

The application accesses objects with server-side AWS credentials. Browser uploads use short-lived presigned PUT URLs.

## 2. Configure bucket CORS for Admin uploads

The Admin browser uploads directly to S3, so add a CORS rule to **both buckets**. Replace the preview origin with the Vercel Preview URL you are actually testing.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://cobbinaemmanuel.tech",
      "https://YOUR-QA-PREVIEW.vercel.app"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

When the QA preview URL changes, add the new exact origin while testing. The production origin should stay in the rule.

## 3. Create a least-privilege IAM identity

Create an IAM user or deploy-time IAM identity dedicated to this application. Do not use the AWS root account.

Attach a policy like the following, replacing the bucket names:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListAssetBuckets",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::YOUR_PRIVATE_RESOURCE_BUCKET",
        "arn:aws:s3:::YOUR_MEDIA_BUCKET"
      ]
    },
    {
      "Sid": "ManageAssetObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_PRIVATE_RESOURCE_BUCKET/*",
        "arn:aws:s3:::YOUR_MEDIA_BUCKET/*"
      ]
    }
  ]
}
```

The current application does not delete S3 objects, so `s3:DeleteObject` is intentionally omitted.

Create an access key for this application identity and store it only in `.env.local` / Vercel server-side environment variables.

## 4. Add environment variables

Add these to `.env.local` and to the appropriate Vercel Preview/Production environments:

```env
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_RESOURCE_BUCKET=your-private-resource-bucket
AWS_S3_MEDIA_BUCKET=your-media-bucket
AWS_S3_UPLOAD_MAX_MB=250
```

`AWS_SESSION_TOKEN` is optional and is only needed when using temporary credentials.

Never create `NEXT_PUBLIC_AWS_ACCESS_KEY_ID` or `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY`.

## 5. Install the AWS SDK packages

After pulling/applying this code:

```powershell
npm install
```

This installs the AWS SDK v3 S3 client and presigner declared in `package.json` and updates `package-lock.json` on your machine.

## 6. Run the Supabase migration

Run once in Supabase SQL Editor, after the previous migrations:

```text
supabase/005_s3_asset_library.sql
```

The migration creates:

- `media_assets`
- `prepared_resources`
- `resources.file_asset_id`
- `resources.thumbnail_asset_id`
- `resources.prepared_resource_id`
- `content_items.cover_asset_id`

Existing `file_url` and `thumbnail_url` fields remain as legacy fallbacks, so current resources are not broken.

## 7. Test an upload from Admin

Go to:

```text
/admin → Asset Library
```

Choose an asset type, select a file and click **Upload to S3**.

The workflow is:

```text
Admin browser
  → authenticated /api/admin/assets/presign
  → short-lived S3 PUT URL
  → browser uploads directly to private S3
  → /api/admin/assets catalogs the object in Supabase
```

The Asset Library displays the permanent storage location as `s3://bucket/key`. No permanent public file URL is created.

## 8. Prepare a resource

Still under **Asset Library**:

1. Select an uploaded resource file.
2. Select an uploaded thumbnail if applicable.
3. Add an optional external URL.
4. Set Free/Paid, price, currency and category.
5. Save the prepared resource.

Then open:

```text
/admin → Resources → New resource
```

Choose the prepared resource first. The form automatically fills the S3 file, thumbnail, payment type, price/currency, category and external URL. Complete the description, SEO and publishing fields and save.

## 9. Upload locally from PowerShell

Files can also be uploaded from the project directory:

```powershell
npm run asset:upload -- --file ".\resources\aws-checklist.pdf" --type resource_file --name "AWS EC2 Production Checklist"
```

Image example:

```powershell
npm run asset:upload -- --file ".\covers\aws-checklist.webp" --type resource_thumbnail --name "AWS Checklist Cover" --alt "AWS EC2 production deployment checklist cover"
```

Valid `--type` values:

- `resource_file`
- `resource_thumbnail`
- `blog_image`
- `insight_image`
- `general_image`

The script uploads to S3 and creates the `media_assets` catalog record in Supabase.

## 10. Sync objects uploaded directly through AWS

If you upload an object through the AWS Console, keep it under one of these prefixes:

```text
Private resource bucket:
resource-files/

Media bucket:
resource-thumbnails/
blog-images/
insight-images/
general-media/
```

Then use:

```text
/admin → Asset Library → Sync with S3
```

The application uses S3 `ListObjectsV2` and catalogs previously unknown objects.

## 11. How media is exposed publicly

Media objects stay private in S3. Public pages use:

```text
/api/media/<asset-id>
```

The server verifies that the asset is an active image and streams it from the private media bucket.

Downloadable resource files are never exposed through `/api/media`. They continue through the existing free/paid download authorization routes.

## 12. Blog and insight media

The Content editor now supports:

- selecting an S3 cover image;
- inserting an S3 image into Markdown;
- inserting a normal clickable Markdown link;
- inserting a link to an existing published Resource/Product.

The article renderer styles Markdown images and already supports internal and external clickable links.

## 13. Recommended production follow-up

At higher traffic, put CloudFront in front of the media bucket or move the public media route to signed CloudFront/S3 delivery. The current private proxy approach is deliberately simpler for the first production iteration and keeps the bucket private without requiring CloudFront setup immediately.
