
CREATE OR REPLACE FUNCTION public.yarper_answer_game(
  p_game_id uuid, p_couple_id uuid, p_role text, p_answer text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_game public.yarper_game_sessions%rowtype;
BEGIN
  IF p_role NOT IN ('player1','player2')
     OR p_answer IS NULL OR char_length(btrim(p_answer)) < 1
     OR char_length(p_answer) > 1000 THEN
    RAISE EXCEPTION 'INVALID_ANSWER' USING ERRCODE='22023';
  END IF;

  SELECT * INTO v_game
  FROM public.yarper_game_sessions
  WHERE id=p_game_id AND couple_id=p_couple_id
  FOR UPDATE;

  IF NOT FOUND OR v_game.status <> 'waiting' THEN
    RAISE EXCEPTION 'ROUND_NOT_WAITING' USING ERRCODE='P0001';
  END IF;

  IF v_game.selected_by = p_role THEN
    RAISE EXCEPTION 'SELECTING_PLAYER_CANNOT_ANSWER' USING ERRCODE='42501';
  END IF;

  UPDATE public.yarper_game_sessions
  SET answer=btrim(p_answer), answered_by=p_role,
      status='answered', answered_at=clock_timestamp()
  WHERE id=p_game_id;

  UPDATE public.yarper_state
  SET xp=xp+10, rounds=rounds+1,
      current_turn=v_game.selected_by, updated_at=clock_timestamp()
  WHERE couple_id=p_couple_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'COUPLE_STATE_NOT_FOUND' USING ERRCODE='P0002';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.yarper_complete_daily(p_couple_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE v_state public.yarper_state%rowtype;
BEGIN
  SELECT * INTO v_state
  FROM public.yarper_state
  WHERE couple_id=p_couple_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'COUPLE_STATE_NOT_FOUND' USING ERRCODE='P0002';
  END IF;

  IF v_state.daily_done THEN RETURN false; END IF;

  UPDATE public.yarper_state
  SET daily_done=true, xp=xp+25, updated_at=clock_timestamp()
  WHERE couple_id=p_couple_id;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.yarper_claim_streak(p_couple_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE v_state public.yarper_state%rowtype;
BEGIN
  SELECT * INTO v_state
  FROM public.yarper_state
  WHERE couple_id=p_couple_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'COUPLE_STATE_NOT_FOUND' USING ERRCODE='P0002';
  END IF;

  IF v_state.streak_claimed THEN RETURN false; END IF;

  UPDATE public.yarper_state
  SET streak_claimed=true, streak=streak+1, xp=xp+15,
      updated_at=clock_timestamp()
  WHERE couple_id=p_couple_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.yarper_answer_game(uuid,uuid,text,text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.yarper_complete_daily(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.yarper_claim_streak(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.yarper_answer_game(uuid,uuid,text,text) TO service_role;
GRANT EXECUTE ON FUNCTION public.yarper_complete_daily(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.yarper_claim_streak(uuid) TO service_role;
