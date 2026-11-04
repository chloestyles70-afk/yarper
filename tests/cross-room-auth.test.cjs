const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'functions', 'yarper-api', 'index.ts'),
  'utf8'
);

test('authenticated API actions derive their room from the validated device token', () => {
  assert.match(source, /async function memberFromToken\(t:string\)/);
  assert.match(source, /\.eq\("device_token_hash",h\)/);
  assert.match(source, /!isSessionActive\(r\.data\.token_expires_at,r\.data\.token_revoked_at\)/);
  assert.match(source, /const member=await memberFromToken\(String\(req\.headers\.get\("x-yarper-token"\)\|\|""\)\)/);
});

test('snapshots only return members, games and reactions from the authenticated member room', () => {
  const start = source.indexOf('async function snapshot(');
  const end = source.indexOf('Deno.serve(', start);
  assert.notEqual(start, -1);
  const snapshot = source.slice(start, end);
  assert.ok((snapshot.match(/\.eq\("couple_id",member\.couple_id\)/g) || []).length >= 4);
});

test('answer RPC binds the target game to the authenticated member room', () => {
  assert.match(source, /db\.rpc\("yarper_answer_game",\{p_game_id:gameId,p_couple_id:member\.couple_id,p_role:member\.role,p_answer:answer\}\)/);
});

test('reaction lookup requires both the game ID and authenticated room ID', () => {
  assert.match(source, /\.eq\("id",gameId\)\.eq\("couple_id",member\.couple_id\)\.maybeSingle\(\)/);
});

test('room deletion is scoped to the authenticated member room', () => {
  assert.match(source, /db\.from\("yarper_couples"\)\.delete\(\)\.eq\("id",member\.couple_id\)/);
});
