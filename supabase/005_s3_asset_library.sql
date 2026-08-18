-- Phase 6: S3 Asset Library and prepared-resource workflow.
-- Run after 004_seo_analytics.sql.

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (
    asset_type in ('resource_file', 'resource_thumbnail', 'blog_image', 'insight_image', 'general_image')
  ),
  display_name text not null,
  original_filename text not null,
  bucket text not null,
  s3_key text not null,
  mime_type text not null,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  etag text,
  alt_text text,
  caption text,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, s3_key)
);

create index if not exists media_assets_type_status_idx
  on public.media_assets (asset_type, status, created_at desc);

create index if not exists media_assets_s3_key_idx
  on public.media_assets (bucket, s3_key);

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

alter table public.media_assets enable row level security;
-- No public policies. Asset metadata is managed through authenticated admin/server routes.

create table if not exists public.prepared_resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  file_asset_id uuid references public.media_assets(id) on delete set null,
  thumbnail_asset_id uuid references public.media_assets(id) on delete set null,
  external_url text,
  default_type text not null default 'free_resource'
    check (default_type in ('free_resource', 'paid_product')),
  default_price numeric(10,2) not null default 0 check (default_price >= 0),
  default_currency text not null default 'GHS',
  default_category text not null default 'engineering',
  notes text,
  status text not null default 'ready' check (status in ('draft', 'ready', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prepared_resources_status_idx
  on public.prepared_resources (status, updated_at desc);

drop trigger if exists prepared_resources_set_updated_at on public.prepared_resources;
create trigger prepared_resources_set_updated_at
before update on public.prepared_resources
for each row execute function public.set_updated_at();

alter table public.prepared_resources enable row level security;
-- No public policies. Prepared resources are admin-only catalog records.

alter table public.resources
  add column if not exists file_asset_id uuid references public.media_assets(id) on delete set null,
  add column if not exists thumbnail_asset_id uuid references public.media_assets(id) on delete set null,
  add column if not exists prepared_resource_id uuid references public.prepared_resources(id) on delete set null,
  add column if not exists has_download boolean not null default false;

update public.resources
set has_download = true
where file_url is not null and length(trim(file_url)) > 0;

grant select (has_download) on table public.resources to anon, authenticated;

create index if not exists resources_file_asset_idx on public.resources (file_asset_id);
create index if not exists resources_thumbnail_asset_idx on public.resources (thumbnail_asset_id);

alter table public.content_items
  add column if not exists cover_asset_id uuid references public.media_assets(id) on delete set null;

create index if not exists content_items_cover_asset_idx on public.content_items (cover_asset_id);
