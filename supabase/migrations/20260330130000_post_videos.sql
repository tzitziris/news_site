-- Many YouTube (or compatible) links per post. Store full watch/share URLs in `url`.
-- Legacy: `posts.video_url` still works in the app if `post_videos` is empty.

create table if not exists public.post_videos (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists post_videos_post_sort_idx
  on public.post_videos (post_id, sort_order);

alter table public.post_videos enable row level security;

drop policy if exists "Public read videos of published posts" on public.post_videos;

create policy "Public read videos of published posts"
  on public.post_videos
  for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.published = true
    )
  );
