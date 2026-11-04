
drop table if exists public.yarper_reactions cascade;
drop table if exists public.yarper_game_sessions cascade;
drop table if exists public.yarper_state cascade;
drop table if exists public.yarper_members cascade;
drop table if exists public.yarper_couples cascade;

create table public.yarper_couples (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z2-9]{6}$'),
  created_at timestamptz not null default now()
);

create table public.yarper_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.yarper_couples(id) on delete cascade,
  device_token_hash text not null unique,
  display_name text not null check (char_length(display_name) between 1 and 40),
  role text not null check (role in ('player1','player2')),
  online boolean not null default true,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(couple_id, role)
);

create table public.yarper_state (
  couple_id uuid primary key references public.yarper_couples(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  rounds integer not null default 0 check (rounds >= 0),
  streak integer not null default 0 check (streak >= 0),
  current_turn text not null default 'player1' check (current_turn in ('player1','player2')),
  daily text not null default '',
  daily_done boolean not null default false,
  streak_claimed boolean not null default false,
  state_day date not null default current_date,
  updated_at timestamptz not null default now()
);

create table public.yarper_game_sessions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.yarper_couples(id) on delete cascade,
  game_mode text not null,
  question text not null,
  selected_by text not null check (selected_by in ('player1','player2')),
  answer text,
  answered_by text check (answered_by in ('player1','player2')),
  status text not null default 'waiting' check (status in ('waiting','answered')),
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

create table public.yarper_reactions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.yarper_couples(id) on delete cascade,
  game_id uuid not null references public.yarper_game_sessions(id) on delete cascade,
  by_role text not null check (by_role in ('player1','player2')),
  emoji text not null check (char_length(emoji) between 1 and 8),
  created_at timestamptz not null default now()
);

create index yarper_members_couple_idx on public.yarper_members(couple_id);
create index yarper_games_couple_idx on public.yarper_game_sessions(couple_id, created_at desc);
create index yarper_reactions_game_idx on public.yarper_reactions(game_id, created_at desc);

alter table public.yarper_couples enable row level security;
alter table public.yarper_members enable row level security;
alter table public.yarper_state enable row level security;
alter table public.yarper_game_sessions enable row level security;
alter table public.yarper_reactions enable row level security;

revoke all on public.yarper_couples from anon, authenticated;
revoke all on public.yarper_members from anon, authenticated;
revoke all on public.yarper_state from anon, authenticated;
revoke all on public.yarper_game_sessions from anon, authenticated;
revoke all on public.yarper_reactions from anon, authenticated;
