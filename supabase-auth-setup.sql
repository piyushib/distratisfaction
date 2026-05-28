-- ============================================================
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Profiles table (stores username per user)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read all profiles"
  on profiles for select using (true);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);


-- 2. User tasks table (for cross-device sync)
create table if not exists user_tasks (
  id uuid primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null check (category in ('learn', 'absorb', 'hustle', 'reset')),
  text text not null,
  created_at bigint not null
);

alter table user_tasks enable row level security;

create policy "Users can manage own tasks"
  on user_tasks for all using (auth.uid() = user_id);


-- 3. User sessions table (for cross-device sync)
create table if not exists user_sessions (
  id uuid primary key,
  user_id uuid references auth.users on delete cascade not null,
  task_text text not null,
  category text not null check (category in ('learn', 'absorb', 'hustle', 'reset')),
  completed boolean not null default false,
  note text,
  started_at bigint not null,
  ended_at bigint not null
);

alter table user_sessions enable row level security;

create policy "Users can manage own sessions"
  on user_sessions for all using (auth.uid() = user_id);


-- 4. Add username column to community_tasks (if it doesn't exist)
alter table community_tasks add column if not exists username text;


-- 5. Task completion stats (public counter per task_id)
create table if not exists task_stats (
  task_id text primary key,
  completions int not null default 0
);

alter table task_stats enable row level security;

create policy "public read stats"
  on task_stats for select using (true);

-- RPC to atomically increment (avoids race conditions)
create or replace function increment_task_completion(p_task_id text)
returns void language sql as $$
  insert into task_stats (task_id, completions)
  values (p_task_id, 1)
  on conflict (task_id)
  do update set completions = task_stats.completions + 1;
$$;

grant execute on function increment_task_completion(text) to anon, authenticated;
