-- Migration: Enable RLS and create policies for exploring_next table
-- Created: 2025-10-02
-- Purpose: Secure ingestion worker writes and optionally expose public feed reads

-- Ensure RLS is enabled on the table
alter table public.exploring_next enable row level security;

-- Policy 1: Allow Cloudflare Worker (using service_role key) to insert new items
create policy "ingest_worker_can_insert"
  on public.exploring_next
  for insert
  to service_role
  with check (true);

-- Policy 2: Allow Cloudflare Worker to read items (for deduplication checks)
create policy "ingest_worker_can_select"
  on public.exploring_next
  for select
  to service_role
  using (true);

-- Policy 3 (OPTIONAL): Allow public anonymous reads for the feed endpoint
-- Comment this out if you want to keep feed access restricted to service_role only
create policy "public_feed_read"
  on public.exploring_next
  for select
  to anon
  using (true);

-- Future policies (commented for reference):
-- If you add authenticated moderation features, uncomment and customize:
/*
create policy "authenticated_admin_delete"
  on public.exploring_next
  for delete
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'admin'
  );

create policy "authenticated_admin_update"
  on public.exploring_next
  for update
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'admin'
  )
  with check (
    auth.jwt() ->> 'role' = 'admin'
  );
*/
