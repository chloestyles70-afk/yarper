const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('custom question migration enforces couple ownership and private storage', () => {
  const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261108040000_add_yarper_custom_questions.sql'), 'utf8');
  assert.match(sql, /references public\.yarper_couples\(id\) on delete cascade/i);
  assert.match(sql, /references public\.yarper_members\(id\) on delete cascade/i);
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all on table public\.yarper_custom_questions from public, anon, authenticated/i);
  assert.match(sql, /visibility in \('private', 'shared'\)/i);
  assert.match(sql, /game_mode in \('questions', 'challenges', 'truth', 'cards', 'date'\)/i);
});
