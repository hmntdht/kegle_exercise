-- Run this once in your Supabase project's SQL editor (Dashboard -> SQL Editor -> New query).
-- It creates one small table that stores every synced piece of app state
-- (settings, reminders, history, streak, achievements) as JSON, keyed per user.

create table if not exists public.kegel_sync (
  user_id uuid not null references auth.users (id) on delete cascade,
  data_key text not null,
  data_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, data_key)
);

-- Row Level Security: every user can only ever see/change their own rows.
alter table public.kegel_sync enable row level security;

create policy "Users can select their own sync rows"
  on public.kegel_sync for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sync rows"
  on public.kegel_sync for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sync rows"
  on public.kegel_sync for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own sync rows"
  on public.kegel_sync for delete
  using (auth.uid() = user_id);

-- Enable Realtime so a change made on one device shows up live on another
-- while both have the app open. (Dashboard: Database -> Replication -> also
-- toggle "kegel_sync" on, or run the line below.)
alter publication supabase_realtime add table public.kegel_sync;
