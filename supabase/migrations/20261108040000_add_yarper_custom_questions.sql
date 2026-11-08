create table if not exists public.yarper_custom_questions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.yarper_couples(id) on delete cascade,
  creator_member_id uuid not null references public.yarper_members(id) on delete cascade,
  question text not null check (char_length(btrim(question)) between 5 and 240),
  game_mode text not null check (game_mode in ('questions', 'challenges', 'truth', 'cards', 'date')),
  visibility text not null default 'private' check (visibility in ('private', 'shared')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists yarper_custom_questions_couple_mode_idx
  on public.yarper_custom_questions (couple_id, game_mode, created_at desc);

create index if not exists yarper_custom_questions_creator_idx
  on public.yarper_custom_questions (couple_id, creator_member_id, created_at desc);

alter table public.yarper_custom_questions enable row level security;

-- Custom questions are accessed only through the token-authenticated Edge Function.
revoke all on table public.yarper_custom_questions from public, anon, authenticated;
