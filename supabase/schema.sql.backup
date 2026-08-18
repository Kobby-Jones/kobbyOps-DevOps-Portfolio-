-- KobbyOps portfolio content, analytics, and contact schema.
-- Run this once in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('blog', 'insight')),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null,
  content text not null,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  cover_url text,
  seo_title text,
  seo_description text,
  canonical_url text,
  reading_minutes integer not null default 5 check (reading_minutes between 1 and 60),
  featured boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_items_publication_idx
  on public.content_items (status, type, published_at desc);

create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  path text not null,
  visitor_hash text not null,
  referrer_host text,
  created_at timestamptz not null default now()
);

create index if not exists site_events_created_idx on public.site_events (created_at desc);
create index if not exists site_events_path_idx on public.site_events (path, created_at desc);
create index if not exists site_events_visitor_idx on public.site_events (visitor_hash);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
before update on public.content_items
for each row execute function public.set_updated_at();

alter table public.content_items enable row level security;
alter table public.site_events enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Published content is public" on public.content_items;
create policy "Published content is public"
on public.content_items
for select
to anon, authenticated
using (status = 'published' and published_at <= now());

-- site_events and contact_messages intentionally have no public policies.
-- Server routes use SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
-- Admin content writes also remain server-only.
