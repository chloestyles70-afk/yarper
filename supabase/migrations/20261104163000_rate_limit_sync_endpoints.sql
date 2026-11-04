-- Prevent authenticated sync/snapshot endpoints from being abused to exhaust
-- database resources. The normal UI polls every five seconds; 90 requests per
-- five-minute window leaves reasonable headroom while bounding bursts.
CREATE OR REPLACE FUNCTION public.consume_yarper_rate_limit(
  p_key text, p_action text, p_limit integer, p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'private'
AS $rate_limit$
DECLARE
  v_window_start timestamptz;
  v_hits integer;
BEGIN
  IF p_key IS NULL OR length(p_key) < 16 OR length(p_key) > 128
     OR p_action NOT IN (
       'create','join','start_game','advance_game','answer_game','react',
       'rename','complete_daily','claim_streak','delete_room',
       'me','heartbeat','snapshot'
     )
     OR p_limit < 1 OR p_limit > 100
     OR p_window_seconds < 1 OR p_window_seconds > 86400 THEN
    RAISE EXCEPTION 'Invalid rate-limit parameters';
  END IF;

  v_window_start := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );

  INSERT INTO private.yarper_rate_limits(bucket_key, action, window_start, hits)
  VALUES (p_key, p_action, v_window_start, 1)
  ON CONFLICT (bucket_key, action) DO UPDATE
    SET window_start = CASE
          WHEN private.yarper_rate_limits.window_start < excluded.window_start
          THEN excluded.window_start ELSE private.yarper_rate_limits.window_start END,
        hits = CASE
          WHEN private.yarper_rate_limits.window_start < excluded.window_start
          THEN 1 ELSE private.yarper_rate_limits.hits + 1 END
  RETURNING hits INTO v_hits;

  RETURN v_hits <= p_limit;
END;
$rate_limit$;

REVOKE ALL ON FUNCTION public.consume_yarper_rate_limit(text, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_yarper_rate_limit(text, text, integer, integer) TO service_role;
