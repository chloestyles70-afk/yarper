
create extension if not exists pgcrypto;

create table if not exists public.yarper_couples (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z2-9]{6}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.yarper_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.yarper_couples(id) on delete cascade,
  device_token_hash text not null unique,
  display_name text not null check (char_length(trim(display_name)) between 1 and 40),
  role text not null check (role in ('player1','player2')),
  online boolean not null default false,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(couple_id, role),
  unique(couple_id, display_name)
);

create table if not exists public.yarper_state (
  couple_id uuid primary key references public.yarper_couples(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  rounds integer not null default 0 check (rounds >= 0),
  streak integer not null default 0 check (streak >= 0),
  current_turn text not null default 'player1' check (current_turn in ('player1','player2')),
  daily text not null default '',
  daily_done boolean not null default false,
  streak_claimed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.yarper_couples enable row level security;
alter table public.yarper_members enable row level security;
alter table public.yarper_state enable row level security;

revoke all on public.yarper_couples from anon, authenticated;
revoke all on public.yarper_members from anon, authenticated;
revoke all on public.yarper_state from anon, authenticated;

grant usage on schema public to anon, authenticated;

alter publication supabase_realtime add table public.yarper_state;
alter publication supabase_realtime add table public.yarper_members;
