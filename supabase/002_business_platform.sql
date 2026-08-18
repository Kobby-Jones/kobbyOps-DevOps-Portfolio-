-- Business platform extension: services, resources, consultation requests, orders, subscribers.
-- Run in Supabase Dashboard > SQL Editor after the original schema.sql.

-- ─── Services ────────────────────────────────────────────────────────────────

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text not null,
  description text not null,
  icon text,
  capabilities text[] not null default '{}',
  price_label text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_status_order_idx
  on public.services (status, display_order asc);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

alter table public.services enable row level security;

drop policy if exists "Published services are public" on public.services;
create policy "Published services are public"
on public.services for select to anon, authenticated
using (status = 'published');

-- ─── Resources & Digital Products ────────────────────────────────────────────

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text not null,
  description text not null,
  type text not null check (type in ('free_resource', 'paid_product')),
  category text not null default 'engineering',
  price numeric(10,2) not null default 0,
  currency text not null default 'USD',
  thumbnail_url text,
  file_url text,
  external_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resources_status_type_idx
  on public.resources (status, type, created_at desc);

drop trigger if exists resources_set_updated_at on public.resources;
create trigger resources_set_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

alter table public.resources enable row level security;

-- Public reads never expose file_url — the API selects specific columns.
drop policy if exists "Published resources are public" on public.resources;
create policy "Published resources are public"
on public.resources for select to anon, authenticated
using (status = 'published');

-- ─── Consultation / Work-With-Me Requests ────────────────────────────────────

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organization text,
  service_requested text not null,
  project_description text not null,
  budget_range text,
  timeline text,
  website_url text,
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'responded', 'converted', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists consultation_requests_created_idx
  on public.consultation_requests (created_at desc);

alter table public.consultation_requests enable row level security;
-- No public policies — server-only via service role key.

-- ─── Orders ──────────────────────────────────────────────────────────────────

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  customer_name text not null,
  resource_id uuid not null references public.resources(id),
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  payment_reference text,
  payment_provider text,
  download_token text unique,
  download_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status, created_at desc);
create index if not exists orders_email_idx on public.orders (customer_email);
create index if not exists orders_download_token_idx on public.orders (download_token)
  where download_token is not null;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

-- ─── Newsletter Subscribers ──────────────────────────────────────────────────

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now()
);

create index if not exists subscribers_status_idx on public.subscribers (status);

alter table public.subscribers enable row level security;
