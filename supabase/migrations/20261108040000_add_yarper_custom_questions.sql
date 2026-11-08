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
grant select, insert, update, delete on table public.yarper_custom_questions to service_role;

create table if not exists private.yarper_custom_question_rate_limits (
  member_id uuid primary key references public.yarper_members(id) on delete cascade,
  window_start timestamptz not null,
  hits integer not null default 0 check (hits >= 0)
);
alter table private.yarper_custom_question_rate_limits enable row level security;
revoke all on private.yarper_custom_question_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on private.yarper_custom_question_rate_limits to service_role;

create or replace function public.consume_yarper_custom_question_rate_limit(
  p_member_id uuid,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
declare
  v_window_start timestamptz;
  v_hits integer;
begin
  if p_member_id is null or p_limit < 1 or p_limit > 200
     or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'Invalid custom-question rate-limit parameters';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );

  insert into private.yarper_custom_question_rate_limits(member_id, window_start, hits)
  values (p_member_id, v_window_start, 1)
  on conflict (member_id) do update
    set window_start = case
          when private.yarper_custom_question_rate_limits.window_start < excluded.window_start
          then excluded.window_start else private.yarper_custom_question_rate_limits.window_start end,
        hits = case
          when private.yarper_custom_question_rate_limits.window_start < excluded.window_start
          then 1 else private.yarper_custom_question_rate_limits.hits + 1 end
  returning hits into v_hits;

  return v_hits <= p_limit;
end;
$$;

revoke all on function public.consume_yarper_custom_question_rate_limit(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_yarper_custom_question_rate_limit(uuid, integer, integer) to service_role;
