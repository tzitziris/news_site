-- Public bucket for news images; admins upload via dashboard session (RLS).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-media',
  'post-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read post-media" on storage.objects;
create policy "Public read post-media"
  on storage.objects
  for select
  using (bucket_id = 'post-media');

drop policy if exists "Admin insert post-media" on storage.objects;
create policy "Admin insert post-media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'post-media'
    and exists (
      select 1 from public.admin_users a
      where a.user_id = auth.uid()
    )
  );

drop policy if exists "Admin update post-media" on storage.objects;
create policy "Admin update post-media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'post-media'
    and exists (
      select 1 from public.admin_users a
      where a.user_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'post-media'
    and exists (
      select 1 from public.admin_users a
      where a.user_id = auth.uid()
    )
  );

drop policy if exists "Admin delete post-media" on storage.objects;
create policy "Admin delete post-media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'post-media'
    and exists (
      select 1 from public.admin_users a
      where a.user_id = auth.uid()
    )
  );
