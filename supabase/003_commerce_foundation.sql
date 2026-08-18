-- Phase 3: Commerce foundation hardening.
-- Run after 002_business_platform.sql.

-- Keep the private file location inaccessible even to direct anon/authenticated
-- Supabase queries. Public application reads already select only these columns.
revoke select on table public.resources from anon, authenticated;
grant select (
  id, title, slug, short_description, description, type, category, price, currency,
  thumbnail_url, external_url, status, featured, seo_title, seo_description,
  download_count, created_at, updated_at
) on table public.resources to anon, authenticated;

create unique index if not exists orders_payment_reference_unique_idx
  on public.orders (payment_reference)
  where payment_reference is not null;

create or replace function public.increment_resource_download_count(p_resource_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.resources
  set download_count = download_count + 1
  where id = p_resource_id;
$$;

revoke all on function public.increment_resource_download_count(uuid) from public;
revoke all on function public.increment_resource_download_count(uuid) from anon;
revoke all on function public.increment_resource_download_count(uuid) from authenticated;
grant execute on function public.increment_resource_download_count(uuid) to service_role;
