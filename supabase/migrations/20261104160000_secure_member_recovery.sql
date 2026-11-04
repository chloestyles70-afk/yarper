-- Harden recovery: a room code and display name are not proof of identity.
-- A member must also prove possession of the previous device secret.
DROP FUNCTION IF EXISTS public.join_yarper_couple(text, text, text);

CREATE OR REPLACE FUNCTION public.join_yarper_couple(
  p_code text,
  p_display_name text,
  p_device_token_hash text,
  p_recovery_token_hash text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_couple_id uuid;
  v_code text;
  v_member public.yarper_members%rowtype;
  v_count integer;
BEGIN
  IF p_code IS NULL OR p_code !~ '^[A-Z2-9]{6}$' THEN
    RAISE EXCEPTION 'INVALID_CODE' USING errcode = '22023';
  END IF;
  IF p_display_name IS NULL OR char_length(btrim(p_display_name)) < 1
     OR char_length(btrim(p_display_name)) > 40 THEN
    RAISE EXCEPTION 'INVALID_DISPLAY_NAME' USING errcode = '22023';
  END IF;
  IF p_device_token_hash IS NULL OR p_device_token_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'INVALID_DEVICE_TOKEN_HASH' USING errcode = '22023';
  END IF;
  IF p_recovery_token_hash IS NOT NULL
     AND p_recovery_token_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'INVALID_RECOVERY_TOKEN_HASH' USING errcode = '22023';
  END IF;

  -- Serialize join and recovery attempts for this couple.
  SELECT c.id, c.code INTO v_couple_id, v_code
  FROM public.yarper_couples AS c
  WHERE c.code = p_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'COUPLE_NOT_FOUND' USING errcode = 'P0002';
  END IF;

  -- A matching name locates a possible inactive slot, but never authorizes it.
  SELECT m.* INTO v_member
  FROM public.yarper_members AS m
  WHERE m.couple_id = v_couple_id
    AND m.display_name = btrim(p_display_name)
    AND (m.token_revoked_at IS NOT NULL OR m.token_expires_at <= now())
  ORDER BY m.created_at ASC
  LIMIT 1
  FOR UPDATE;

  IF FOUND THEN
    IF p_recovery_token_hash IS NULL
       OR v_member.device_token_hash <> p_recovery_token_hash THEN
      RAISE EXCEPTION 'COUPLE_FULL' USING errcode = 'P0001';
    END IF;

    UPDATE public.yarper_members
    SET device_token_hash = p_device_token_hash,
        online = true,
        last_seen = now(),
        token_expires_at = now() + interval '30 days',
        token_revoked_at = NULL
    WHERE id = v_member.id
    RETURNING * INTO v_member;

    RETURN jsonb_build_object(
      'id', v_member.id,
      'couple_id', v_member.couple_id,
      'display_name', v_member.display_name,
      'role', v_member.role,
      'online', v_member.online,
      'last_seen', v_member.last_seen,
      'code', v_code
    );
  END IF;

  SELECT count(*)::integer INTO v_count
  FROM public.yarper_members AS m
  WHERE m.couple_id = v_couple_id;

  IF v_count >= 2 THEN
    RAISE EXCEPTION 'COUPLE_FULL' USING errcode = 'P0001';
  END IF;

  INSERT INTO public.yarper_members (
    couple_id, device_token_hash, display_name, role, online, last_seen,
    token_expires_at, token_revoked_at
  )
  VALUES (
    v_couple_id, p_device_token_hash, btrim(p_display_name),
    'player2', true, now(), now() + interval '30 days', NULL
  )
  RETURNING * INTO v_member;

  RETURN jsonb_build_object(
    'id', v_member.id,
    'couple_id', v_member.couple_id,
    'display_name', v_member.display_name,
    'role', v_member.role,
    'online', v_member.online,
    'last_seen', v_member.last_seen,
    'code', v_code
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.join_yarper_couple(text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_yarper_couple(text, text, text, text) TO service_role;
