import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.118.0";
import { isSessionActive } from "../yarper-api/session-policy.mjs";
import {
  CUSTOM_QUESTION_MODES,
  CUSTOM_QUESTION_VISIBILITIES,
  canManageCustomQuestion,
  cleanCustomQuestion,
  isCustomQuestionEligible,
} from "./policy.mjs";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const db = createClient(SUPABASE_URL, SERVICE_KEY);
const ALLOWED_ORIGIN = "https://yarper.vercel.app";
const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Vary": "Origin",
  "Access-Control-Allow-Headers": "content-type, authorization, x-yarper-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function authenticate(token: string) {
  if (!token || token.length > 512) throw new Error("Your Yarper session is missing.");
  const hash = await sha256(token);
  const result = await db.from("yarper_members")
    .select("id,couple_id,role,token_expires_at,token_revoked_at")
    .eq("device_token_hash", hash)
    .maybeSingle();
  if (result.error || !result.data ||
      !isSessionActive(result.data.token_expires_at, result.data.token_revoked_at)) {
    throw new Error("Session expired or revoked. Reconnect to your couple space.");
  }
  return result.data;
}

function validateMode(value: unknown) {
  const mode = String(value ?? "");
  if (!CUSTOM_QUESTION_MODES.includes(mode as typeof CUSTOM_QUESTION_MODES[number])) {
    throw new Error("Choose a valid game category.");
  }
  return mode;
}

function validateVisibility(value: unknown) {
  const visibility = String(value ?? "");
  if (!CUSTOM_QUESTION_VISIBILITIES.includes(visibility as typeof CUSTOM_QUESTION_VISIBILITIES[number])) {
    throw new Error("Choose Private or Shared.");
  }
  return visibility;
}

async function handle(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed." }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (!req.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ error: "Content-Type must be application/json." }, 415);
  }

  const raw = await req.text();
  if (raw.length > 8192) return json({ error: "Request is too large." }, 413);

  try {
    const body = JSON.parse(raw);
    const member = await authenticate(String(req.headers.get("x-yarper-token") || ""));
    const action = String(body.action || "");

    if (action === "list") {
      const result = await db.from("yarper_custom_questions")
        .select("id,question,game_mode,visibility,created_at,updated_at")
        .eq("couple_id", member.couple_id)
        .eq("creator_member_id", member.id)
        .order("created_at", { ascending: false });
      if (result.error) throw new Error("Could not load your custom questions.");
      return json({ questions: result.data || [] });
    }

    if (action === "pool") {
      const gameMode = validateMode(body.game_mode);
      const result = await db.from("yarper_custom_questions")
        .select("id,question,game_mode,visibility,creator_member_id,couple_id")
        .eq("couple_id", member.couple_id)
        .eq("game_mode", gameMode)
        .order("created_at", { ascending: false });
      if (result.error) throw new Error("Could not load custom prompts.");
      const eligible = (result.data || []).filter((question) =>
        isCustomQuestionEligible(question, member, gameMode)
      ).map(({ id, question, visibility }) => ({ id, question, visibility }));
      return json({ questions: eligible });
    }

    if (action === "create") {
      const question = cleanCustomQuestion(body.question);
      const gameMode = validateMode(body.game_mode);
      const visibility = validateVisibility(body.visibility);
      const count = await db.from("yarper_custom_questions")
        .select("id", { count: "exact", head: true })
        .eq("couple_id", member.couple_id)
        .eq("creator_member_id", member.id);
      if (count.error) throw new Error("Could not check your question limit.");
      if ((count.count || 0) >= 100) return json({ error: "You can save up to 100 questions." }, 409);

      const created = await db.from("yarper_custom_questions")
        .insert({
          couple_id: member.couple_id,
          creator_member_id: member.id,
          question,
          game_mode: gameMode,
          visibility,
        })
        .select("id,question,game_mode,visibility,created_at,updated_at")
        .single();
      if (created.error || !created.data) throw new Error("Could not save your question.");
      return json({ question: created.data }, 201);
    }

    if (action === "update") {
      const id = String(body.id || "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Question not found." }, 404);
      const question = cleanCustomQuestion(body.question);
      const gameMode = validateMode(body.game_mode);
      const visibility = validateVisibility(body.visibility);
      const existing = await db.from("yarper_custom_questions")
        .select("id,couple_id,creator_member_id")
        .eq("id", id)
        .eq("couple_id", member.couple_id)
        .maybeSingle();
      if (existing.error || !existing.data || !canManageCustomQuestion(existing.data, member)) {
        return json({ error: "You can only edit your own questions." }, 403);
      }
      const updated = await db.from("yarper_custom_questions")
        .update({ question, game_mode: gameMode, visibility, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("couple_id", member.couple_id)
        .eq("creator_member_id", member.id)
        .select("id,question,game_mode,visibility,created_at,updated_at")
        .single();
      if (updated.error || !updated.data) throw new Error("Could not update your question.");
      return json({ question: updated.data });
    }

    if (action === "delete") {
      const id = String(body.id || "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Question not found." }, 404);
      const existing = await db.from("yarper_custom_questions")
        .select("id,couple_id,creator_member_id")
        .eq("id", id)
        .eq("couple_id", member.couple_id)
        .maybeSingle();
      if (existing.error || !existing.data || !canManageCustomQuestion(existing.data, member)) {
        return json({ error: "You can only delete your own questions." }, 403);
      }
      const removed = await db.from("yarper_custom_questions")
        .delete()
        .eq("id", id)
        .eq("couple_id", member.couple_id)
        .eq("creator_member_id", member.id)
        .select("id")
        .maybeSingle();
      if (removed.error || !removed.data) throw new Error("Could not delete your question.");
      return json({ deleted: true });
    }

    return json({ error: "Unknown custom-question action." }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    const status = /session is missing|Session expired|Reconnect to your couple/.test(message) ? 401 : 400;
    return json({ error: message }, status);
  }
}

Deno.serve(handle);
