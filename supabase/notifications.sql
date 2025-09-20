-- Types
create type if not exists public.notification_type as enum ('text','image','video','audio');

-- Table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text,
  body text,
  type public.notification_type not null,
  media_bucket text,
  media_path text,
  published boolean default true
);

-- Indexes
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);
create index if not exists notifications_type_idx on public.notifications(type);

-- RLS
alter table public.notifications enable row level security;
create policy if not exists "public read published" on public.notifications for select using (published);

-- Realtime
alter publication supabase_realtime add table public.notifications;

-- Storage bucket
select storage.create_bucket('notifications', public := true, file_size_limit := 52428800);

-- Storage policies
create policy if not exists "public read bucket" on storage.objects for select to anon using (bucket_id = 'notifications');
create policy if not exists "auth write bucket" on storage.objects for insert to authenticated with check (bucket_id = 'notifications');
create policy if not exists "auth update bucket" on storage.objects for update to authenticated using (bucket_id = 'notifications');
create policy if not exists "auth delete bucket" on storage.objects for delete to authenticated using (bucket_id = 'notifications');
