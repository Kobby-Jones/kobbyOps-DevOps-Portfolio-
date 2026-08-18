-- Phase 4: SEO & conversion analytics extension.
-- Run after 003_commerce_foundation.sql.

alter table public.site_events
  add column if not exists event_name text not null default 'page_view',
  add column if not exists event_label text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists site_events_event_name_created_idx
  on public.site_events (event_name, created_at desc);

create index if not exists site_events_event_label_created_idx
  on public.site_events (event_label, created_at desc)
  where event_label is not null;

comment on column public.site_events.event_name is
  'Privacy-friendly event name such as page_view, service_view, cta_click, or checkout_initiated.';

comment on column public.site_events.event_label is
  'Optional non-sensitive label used to distinguish services, CTAs, and products.';

comment on column public.site_events.metadata is
  'Small non-sensitive event metadata. Do not store customer names, email addresses, payment references, or secrets.';
