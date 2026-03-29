-- Admins: link Supabase Auth users allowed to manage posts/media.
-- After migration: create a user (Authentication → Users), then:
--   insert into public.admin_users (user_id) values ('<auth.users.id>');

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can see own row" on public.admin_users;

create policy "Admins can see own row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- Posts: admins can read/update/delete all rows; public still reads published only.
drop policy if exists "Admins read all posts" on public.posts;
create policy "Admins read all posts"
  on public.posts
  for select
  to authenticated
  using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

drop policy if exists "Admins insert posts" on public.posts;
create policy "Admins insert posts"
  on public.posts
  for insert
  to authenticated
  with check (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

drop policy if exists "Admins update posts" on public.posts;
create policy "Admins update posts"
  on public.posts
  for update
  to authenticated
  using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

drop policy if exists "Admins delete posts" on public.posts;
create policy "Admins delete posts"
  on public.posts
  for delete
  to authenticated
  using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

-- post_images / post_videos: full access for admins (public keeps read via existing policies).
drop policy if exists "Admins manage post_images" on public.post_images;
create policy "Admins manage post_images"
  on public.post_images
  for all
  to authenticated
  using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

drop policy if exists "Admins manage post_videos" on public.post_videos;
create policy "Admins manage post_videos"
  on public.post_videos
  for all
  to authenticated
  using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );
