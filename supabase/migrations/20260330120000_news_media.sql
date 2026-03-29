-- Idempotent: run once in Supabase → SQL Editor (fixes "column does not exist" + gallery).
-- Images: store public URLs only (e.g. Supabase Storage). Video: store YouTube URL on posts.video_url.

alter table public.posts add column if not exists cover_image_url text;
alter table public.posts add column if not exists slug text;
alter table public.posts add column if not exists video_url text;

create unique index if not exists posts_slug_unique
  on public.posts (slug)
  where slug is not null and length(trim(slug)) > 0;

create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists post_images_post_sort_idx
  on public.post_images (post_id, sort_order);

alter table public.post_images enable row level security;

drop policy if exists "Public read images of published posts" on public.post_images;

create policy "Public read images of published posts"
  on public.post_images
  for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.published = true
    )
  );
