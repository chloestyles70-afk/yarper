
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table if not exists private.yarper_rate_limits (
  bucket_key text not null,
  action text not null,
  window_start timestamptz not null,
  hits integer not null default 0 check (hits >= 0),
  primary key (bucket_key, action)
);
alter table private.yarper_rate_limits enable row level security;
revoke all on private.yarper_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on private.yarper_rate_limits to service_role;

create or replace function public.consume_yarper_rate_limit(
  p_key text,
  p_action text,
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
  if p_key is null or length(p_key) < 16 or length(p_key) > 128
     or p_action not in ('create','join')
     or p_limit < 1 or p_limit > 100
     or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'Invalid rate-limit parameters';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );

  insert into private.yarper_rate_limits(bucket_key, action, window_start, hits)
  values (p_key, p_action, v_window_start, 1)
  on conflict (bucket_key, action) do update
    set window_start = case
          when private.yarper_rate_limits.window_start < excluded.window_start
          then excluded.window_start else private.yarper_rate_limits.window_start end,
        hits = case
          when private.yarper_rate_limits.window_start < excluded.window_start
          then 1 else private.yarper_rate_limits.hits + 1 end
  returning hits into v_hits;

  return v_hits <= p_limit;
end;
$$;

revoke all on function public.consume_yarper_rate_limit(text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_yarper_rate_limit(text,text,integer,integer) to service_role;
