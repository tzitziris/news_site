-- Optional cover image (public URL) and readable URL slug for news cards / detail pages.

alter table public.posts
  add column if not exists cover_image_url text;

alter table public.posts
  add column if not exists slug text;

create unique index if not exists posts_slug_unique
  on public.posts (slug)
  where slug is not null and length(trim(slug)) > 0;
