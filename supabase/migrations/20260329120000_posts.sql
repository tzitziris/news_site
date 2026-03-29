-- Public news posts. Apply in Supabase SQL Editor or via Supabase CLI.
-- RLS: anonymous users can only read rows marked published.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  body text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  cover_image_url text,
  slug text,
  video_url text
);

create index if not exists posts_published_published_at_idx
  on public.posts (published, published_at desc nulls last);

alter table public.posts enable row level security;

create policy "Allow public read of published posts"
  on public.posts
  for select
  using (published = true);

-- No insert/update/delete for anon — manage content via Dashboard or service role on server.
