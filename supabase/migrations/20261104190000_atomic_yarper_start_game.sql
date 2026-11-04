-- Keep round creation and turn advancement in one transaction.
-- The state row lock serializes competing starts from both devices.
CREATE OR REPLACE FUNCTION public.yarper_start_game(
  p_couple_id uuid,
  p_role text,
  p_game_mode text,
  p_question text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_state public.yarper_state%rowtype;
  v_latest_status text;
BEGIN
  IF p_role NOT IN ('player1', 'player2')
     OR p_game_mode NOT IN ('questions', 'challenges', 'truth', 'cards', 'date')
     OR p_question IS NULL
     OR char_length(btrim(p_question)) < 1
     OR char_length(p_question) > 300 THEN
    RAISE EXCEPTION 'INVALID_GAME' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_state
  FROM public.yarper_state
  WHERE couple_id = p_couple_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'COUPLE_STATE_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_state.current_turn <> p_role THEN
    RAISE EXCEPTION 'NOT_YOUR_TURN' USING ERRCODE = '42501';
  END IF;

  SELECT status INTO v_latest_status
  FROM public.yarper_game_sessions
  WHERE couple_id = p_couple_id
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  IF v_state.picker_ready IS FALSE AND v_latest_status = 'answered' THEN
    RAISE EXCEPTION 'MUST_ADVANCE' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.yarper_game_sessions
    WHERE couple_id = p_couple_id AND status = 'waiting'
  ) THEN
    RAISE EXCEPTION 'ROUND_ALREADY_WAITING' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.yarper_game_sessions (
    couple_id, game_mode, question, selected_by, status
  ) VALUES (
    p_couple_id, p_game_mode, btrim(p_question), p_role, 'waiting'
  );

  UPDATE public.yarper_state
  SET current_turn = CASE
        WHEN p_role = 'player1' THEN 'player2' ELSE 'player1'
      END,
      picker_ready = false,
      updated_at = clock_timestamp()
  WHERE couple_id = p_couple_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.yarper_start_game(uuid, text, text, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.yarper_start_game(uuid, text, text, text)
  TO service_role;
