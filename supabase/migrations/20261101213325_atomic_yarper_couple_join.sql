
create or replace function public.join_yarper_couple(
  p_code text,
  p_display_name text,
  p_device_token_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_couple_id uuid;
  v_code text;
  v_member public.yarper_members%rowtype;
  v_count integer;
begin
  if p_code is null or p_code !~ '^[A-Z2-9]{6}$' then
    raise exception 'INVALID_CODE' using errcode = '22023';
  end if;
  if p_display_name is null or char_length(btrim(p_display_name)) < 1
     or char_length(btrim(p_display_name)) > 40 then
    raise exception 'INVALID_DISPLAY_NAME' using errcode = '22023';
  end if;
  if p_device_token_hash is null or p_device_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'INVALID_DEVICE_TOKEN_HASH' using errcode = '22023';
  end if;

  -- Serialize all join attempts for this couple on the parent row.
  select c.id, c.code
    into v_couple_id, v_code
  from public.yarper_couples as c
  where c.code = p_code
  for update;

  if not found then
    raise exception 'COUPLE_NOT_FOUND' using errcode = 'P0002';
  end if;

  select count(*)::integer
    into v_count
  from public.yarper_members as m
  where m.couple_id = v_couple_id;

  if v_count >= 2 then
    raise exception 'COUPLE_FULL' using errcode = 'P0001';
  end if;

  insert into public.yarper_members (
    couple_id, device_token_hash, display_name, role, online, last_seen
  )
  values (
    v_couple_id, p_device_token_hash, btrim(p_display_name),
    'player2', true, now()
  )
  returning * into v_member;

  return jsonb_build_object(
    'id', v_member.id,
    'couple_id', v_member.couple_id,
    'display_name', v_member.display_name,
    'role', v_member.role,
    'online', v_member.online,
    'last_seen', v_member.last_seen,
    'code', v_code
  );
end;
$$;

revoke all on function public.join_yarper_couple(text, text, text) from public, anon, authenticated;
grant execute on function public.join_yarper_couple(text, text, text) to service_role;
