
    CREATE UNIQUE INDEX IF NOT EXISTS yarper_one_waiting_session_per_couple_idx
      ON public.yarper_game_sessions (couple_id)
      WHERE status = 'waiting';

    CREATE INDEX IF NOT EXISTS yarper_reactions_couple_id_idx
      ON public.yarper_reactions (couple_id);
  
