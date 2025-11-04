-- Supabase Storage setup for Vizom
-- Create buckets
select storage.create_bucket('user-assets', public := false);
select storage.create_bucket('exports', public := false);
select storage.create_bucket('templates', public := true);

-- RLS Policies on storage.objects
-- Allow users to read/write only their own files in private buckets
create policy if not exists "Private read own files (user-assets/exports)" on storage.objects
for select using (
  (bucket_id in ('user-assets','exports')) and (owner = auth.uid())
);

create policy if not exists "Private insert own files (user-assets/exports)" on storage.objects
for insert with check (
  (bucket_id in ('user-assets','exports')) and (owner = auth.uid())
);

create policy if not exists "Private update own files (user-assets/exports)" on storage.objects
for update using (
  (bucket_id in ('user-assets','exports')) and (owner = auth.uid())
) with check (
  (bucket_id in ('user-assets','exports')) and (owner = auth.uid())
);

create policy if not exists "Private delete own files (user-assets/exports)" on storage.objects
for delete using (
  (bucket_id in ('user-assets','exports')) and (owner = auth.uid())
);

-- Public templates: anyone can read, only owners can write
create policy if not exists "Public read templates" on storage.objects
for select using (
  bucket_id = 'templates'
);

create policy if not exists "Write own templates" on storage.objects
for all using (
  (bucket_id = 'templates') and (owner = auth.uid())
) with check (
  (bucket_id = 'templates') and (owner = auth.uid())
);
