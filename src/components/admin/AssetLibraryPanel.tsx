"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  ExternalLink,
  FileArchive,
  LoaderCircle,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

export type MediaAsset = {
  id: string;
  asset_type: "resource_file" | "resource_thumbnail" | "blog_image" | "insight_image" | "general_image";
  display_name: string;
  original_filename: string;
  bucket: string;
  s3_key: string;
  mime_type: string;
  size_bytes: number;
  etag?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  status: "active" | "archived";
  created_at: string;
};

export type PreparedResource = {
  id: string;
  name: string;
  file_asset_id?: string | null;
  thumbnail_asset_id?: string | null;
  external_url?: string | null;
  default_type: "free_resource" | "paid_product";
  default_price: number;
  default_currency: string;
  default_category: string;
  notes?: string | null;
  status: "draft" | "ready" | "archived";
  file_asset?: MediaAsset | null;
  thumbnail_asset?: MediaAsset | null;
};

const ASSET_OPTIONS: { value: MediaAsset["asset_type"]; label: string }[] = [
  { value: "resource_file", label: "Resource file" },
  { value: "resource_thumbnail", label: "Resource thumbnail" },
  { value: "blog_image", label: "Blog image" },
  { value: "insight_image", label: "Insight image" },
  { value: "general_image", label: "General image" },
];

const initialPrepared = {
  id: "",
  name: "",
  fileAssetId: "",
  thumbnailAssetId: "",
  externalUrl: "",
  defaultType: "free_resource" as "free_resource" | "paid_product",
  defaultPrice: "0",
  defaultCurrency: "GHS",
  defaultCategory: "engineering",
  notes: "",
  status: "ready" as "draft" | "ready" | "archived",
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** exponent).toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export default function AssetLibraryPanel({
  assets,
  preparedResources,
  categories,
  onReload,
  onNotice,
}: {
  assets: MediaAsset[];
  preparedResources: PreparedResource[];
  categories: string[];
  onReload: () => void | Promise<void>;
  onNotice: (message: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<MediaAsset["asset_type"]>("resource_file");
  const [displayName, setDisplayName] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [preparedForm, setPreparedForm] = useState(initialPrepared);
  const [savingPrepared, setSavingPrepared] = useState(false);

  const activeAssets = useMemo(() => assets.filter((asset) => asset.status === "active"), [assets]);
  const resourceFiles = activeAssets.filter((asset) => asset.asset_type === "resource_file");
  const imageAssets = activeAssets.filter((asset) => asset.asset_type !== "resource_file");

  async function uploadAsset(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      onNotice("Choose a file before uploading.");
      return;
    }

    setUploading(true);
    onNotice("");
    try {
      const presign = await fetch("/api/admin/assets/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetType,
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        }),
      });
      const presignResult = await presign.json();
      if (!presign.ok) throw new Error(presignResult.error || "Could not prepare the S3 upload.");

      const upload = await fetch(presignResult.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!upload.ok) {
        throw new Error("S3 rejected the upload. Check bucket CORS and IAM permissions.");
      }

      const register = await fetch("/api/admin/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetType,
          displayName: displayName || file.name,
          originalFilename: file.name,
          contentType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          bucket: presignResult.bucket,
          s3Key: presignResult.key,
          altText,
          caption,
        }),
      });
      const registerResult = await register.json();
      if (!register.ok) throw new Error(registerResult.error || "The file uploaded but could not be cataloged.");

      setFile(null);
      setDisplayName("");
      setAltText("");
      setCaption("");
      const fileInput = document.getElementById("asset-library-file") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      onNotice(`"${registerResult.item.display_name}" uploaded to S3.`);
      await onReload();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function syncS3() {
    setSyncing(true);
    onNotice("");
    try {
      const response = await fetch("/api/admin/assets/sync", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "S3 sync failed.");
      onNotice(`S3 sync complete. ${Number(result.added || 0)} new object(s) added to the Asset Library.`);
      await onReload();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "S3 sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  function editPrepared(item: PreparedResource) {
    setPreparedForm({
      id: item.id,
      name: item.name,
      fileAssetId: item.file_asset_id || "",
      thumbnailAssetId: item.thumbnail_asset_id || "",
      externalUrl: item.external_url || "",
      defaultType: item.default_type,
      defaultPrice: String(item.default_price ?? 0),
      defaultCurrency: item.default_currency || "GHS",
      defaultCategory: item.default_category || "engineering",
      notes: item.notes || "",
      status: item.status,
    });
  }

  async function savePrepared(event: React.FormEvent) {
    event.preventDefault();
    setSavingPrepared(true);
    onNotice("");
    try {
      const response = await fetch("/api/admin/prepared-resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedForm),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Prepared resource could not be saved.");
      onNotice(`"${preparedForm.name}" prepared for publishing.`);
      setPreparedForm(initialPrepared);
      await onReload();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Prepared resource could not be saved.");
    } finally {
      setSavingPrepared(false);
    }
  }

  async function removePrepared(item: PreparedResource) {
    if (!confirm(`Delete prepared resource "${item.name}"? The S3 files will not be deleted.`)) return;
    const response = await fetch(`/api/admin/prepared-resources?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      onNotice(result.error || "Prepared resource could not be deleted.");
      return;
    }
    onNotice(`"${item.name}" removed from the prepared-resource catalog.`);
    await onReload();
  }

  return (
    <section className="py-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-white">S3 Asset Library</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Upload private resource files and reusable media to S3, then prepare them for publishing without copying URLs by hand.
          </p>
        </div>
        <button className="button button-secondary" type="button" onClick={syncS3} disabled={syncing}>
          {syncing ? <LoaderCircle className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          {syncing ? "Syncing" : "Sync with S3"}
        </button>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form className="surface-card p-6" onSubmit={uploadAsset}>
          <p className="eyebrow">Upload</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Add an S3 asset</h2>
          <label className="form-label mt-5">Asset type
            <select className="form-input" value={assetType} onChange={(event) => setAssetType(event.target.value as MediaAsset["asset_type"])}>
              {ASSET_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="form-label mt-5">File
            <input id="asset-library-file" className="form-input" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
          </label>
          <label className="form-label mt-5">Display name <span className="text-zinc-700">(optional)</span>
            <input className="form-input" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder={file?.name || "Friendly asset name"} />
          </label>
          {assetType !== "resource_file" && (
            <>
              <label className="form-label mt-5">Alt text
                <input className="form-input" value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describe the image for accessibility" />
              </label>
              <label className="form-label mt-5">Caption <span className="text-zinc-700">(optional)</span>
                <input className="form-input" value={caption} onChange={(event) => setCaption(event.target.value)} />
              </label>
            </>
          )}
          <button className="button button-primary mt-6 w-full justify-center" type="submit" disabled={uploading}>
            {uploading ? <LoaderCircle className="animate-spin" size={16} /> : <UploadCloud size={16} />}
            {uploading ? "Uploading to S3" : "Upload to S3"}
          </button>
        </form>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-white/10 p-6">
            <p className="eyebrow">Storage catalog</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Available assets</h2>
            <p className="mt-2 text-sm text-zinc-500">{activeAssets.length} active asset(s)</p>
          </div>
          <div className="max-h-[34rem] divide-y divide-white/10 overflow-y-auto">
            {activeAssets.length === 0 ? (
              <p className="p-8 text-center text-sm text-zinc-500">No S3 assets cataloged yet.</p>
            ) : activeAssets.map((asset) => (
              <article className="flex gap-4 p-5" key={asset.id}>
                {asset.asset_type === "resource_file" ? (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"><FileArchive size={22} className="text-teal-400" /></div>
                ) : (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {/* S3 media is served through the private media proxy. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="h-full w-full object-cover" src={`/api/media/${asset.id}`} alt={asset.alt_text || asset.display_name} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-teal-400">{asset.asset_type.replaceAll("_", " ")}</span>
                    <span className="text-xs text-zinc-600">{formatBytes(Number(asset.size_bytes))}</span>
                  </div>
                  <p className="mt-1 truncate font-medium text-white">{asset.display_name}</p>
                  <p className="mt-1 break-all font-mono text-[11px] leading-5 text-zinc-600">s3://{asset.bucket}/{asset.s3_key}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="surface-card p-6" onSubmit={savePrepared}>
          <div className="flex items-center justify-between gap-3">
            <div><p className="eyebrow">Preparation</p><h2 className="mt-2 text-lg font-semibold text-white">{preparedForm.id ? "Edit prepared resource" : "Prepare a resource"}</h2></div>
            {preparedForm.id && <button className="button button-secondary" type="button" onClick={() => setPreparedForm(initialPrepared)}>New</button>}
          </div>
          <label className="form-label mt-5">Resource name
            <input className="form-input" value={preparedForm.name} onChange={(event) => setPreparedForm((prev) => ({ ...prev, name: event.target.value }))} required />
          </label>
          <label className="form-label mt-5">S3 resource file
            <select className="form-input" value={preparedForm.fileAssetId} onChange={(event) => setPreparedForm((prev) => ({ ...prev, fileAssetId: event.target.value }))}>
              <option value="">No file — external resource only</option>
              {resourceFiles.map((asset) => <option key={asset.id} value={asset.id}>{asset.display_name}</option>)}
            </select>
          </label>
          <label className="form-label mt-5">Thumbnail
            <select className="form-input" value={preparedForm.thumbnailAssetId} onChange={(event) => setPreparedForm((prev) => ({ ...prev, thumbnailAssetId: event.target.value }))}>
              <option value="">No thumbnail selected</option>
              {imageAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.display_name} · {asset.asset_type.replaceAll("_", " ")}</option>)}
            </select>
          </label>
          <label className="form-label mt-5">External URL <span className="text-zinc-700">(optional)</span>
            <input className="form-input" type="url" value={preparedForm.externalUrl} onChange={(event) => setPreparedForm((prev) => ({ ...prev, externalUrl: event.target.value }))} placeholder="https://github.com/..." />
          </label>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="form-label">Payment type
              <select className="form-input" value={preparedForm.defaultType} onChange={(event) => setPreparedForm((prev) => ({ ...prev, defaultType: event.target.value as "free_resource" | "paid_product" }))}>
                <option value="free_resource">Free</option>
                <option value="paid_product">Paid</option>
              </select>
            </label>
            <label className="form-label">Category
              <select className="form-input" value={preparedForm.defaultCategory} onChange={(event) => setPreparedForm((prev) => ({ ...prev, defaultCategory: event.target.value }))}>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="form-label">Price
              <input className="form-input" type="number" min="0" step="0.01" disabled={preparedForm.defaultType === "free_resource"} value={preparedForm.defaultType === "free_resource" ? "0" : preparedForm.defaultPrice} onChange={(event) => setPreparedForm((prev) => ({ ...prev, defaultPrice: event.target.value }))} />
            </label>
            <label className="form-label">Currency
              <input className="form-input" maxLength={10} value={preparedForm.defaultCurrency} onChange={(event) => setPreparedForm((prev) => ({ ...prev, defaultCurrency: event.target.value.toUpperCase() }))} />
            </label>
          </div>
          <label className="form-label mt-5">Notes <span className="text-zinc-700">(admin only)</span>
            <textarea className="form-input min-h-24" value={preparedForm.notes} onChange={(event) => setPreparedForm((prev) => ({ ...prev, notes: event.target.value }))} />
          </label>
          <button className="button button-primary mt-6 w-full justify-center" type="submit" disabled={savingPrepared}>
            {savingPrepared ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}
            {savingPrepared ? "Saving" : "Save prepared resource"}
          </button>
        </form>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-white/10 p-6">
            <p className="eyebrow">Ready to publish</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Prepared resources</h2>
          </div>
          <div className="divide-y divide-white/10">
            {preparedResources.length === 0 ? (
              <p className="p-8 text-center text-sm text-zinc-500">No prepared resources yet.</p>
            ) : preparedResources.map((item) => (
              <article className="p-5" key={item.id}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`status-badge ${item.default_type === "paid_product" ? "status-published" : "status-draft"}`}>{item.default_type === "paid_product" ? "Paid" : "Free"}</span>
                      <span className="text-xs text-zinc-500">{item.default_currency} {Number(item.default_price || 0).toFixed(2)}</span>
                      <span className="text-xs capitalize text-zinc-600">{item.default_category}</span>
                    </div>
                    <p className="mt-2 font-medium text-white">{item.name}</p>
                    {item.file_asset ? <p className="mt-1 break-all font-mono text-[11px] leading-5 text-zinc-600">s3://{item.file_asset.bucket}/{item.file_asset.s3_key}</p> : <p className="mt-1 text-xs text-zinc-600">No S3 file attached</p>}
                    {item.external_url && <a className="mt-2 inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300" href={item.external_url} target="_blank" rel="noreferrer">External URL <ExternalLink size={12} /></a>}
                  </div>
                  <div className="flex gap-2">
                    <button className="icon-link" type="button" onClick={() => editPrepared(item)} aria-label={`Edit ${item.name}`}><Pencil size={15} /></button>
                    <button className="icon-link text-rose-400" type="button" onClick={() => removePrepared(item)} aria-label={`Delete ${item.name}`}><Trash2 size={15} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-6 text-zinc-500">
        <Archive size={15} className="mt-0.5 shrink-0 text-teal-400" />
        S3 files remain private. Resource downloads and public images are served through your application after access checks; the admin panel shows the permanent <code className="text-zinc-300">s3://</code> storage location instead of a public file URL.
      </div>
    </section>
  );
}
