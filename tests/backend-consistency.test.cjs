const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'functions', 'yarper-api', 'index.ts'),
  'utf8'
);

test('create compensates by removing a newly-created couple if member or state setup fails', () => {
  const createStart = source.indexOf('if(action==="create")');
  const joinStart = source.indexOf('if(action==="join")', createStart);
  const create = source.slice(createStart, joinStart);
  assert.match(create, /try\s*\{/);
  assert.match(create, /catch\s*\(/);
  assert.match(create, /from\("yarper_couples"\)\.delete\(\)\.eq\("id",couple\.id\)/);
  assert.match(create, /throw/);
});

test('rename reports database update failures instead of returning a stale snapshot', () => {
  const start = source.indexOf('if(action==="rename")');
  const end = source.indexOf('if(action==="start_game")', start);
  const rename = source.slice(start, end);
  assert.match(rename, /updated\.error/);
  assert.match(rename, /updated\.error/);
  assert.match(rename, /updated\.error/);
});

test('daily state initialization and rollover propagate database errors', () => {
  const start = source.indexOf('async function ensureState(');
  const end = source.indexOf('async function snapshot(', start);
  const ensureState = source.slice(start, end);
  assert.match(ensureState, /if\(current\.error\)/);
  assert.match(ensureState, /if\(rollover\.error\)/);
  assert.match(ensureState, /refreshed\.error/);
  assert.match(ensureState, /created\.error/);
});

test('starting a round uses a single transactional database operation', () => {
  assert.match(source, /db\.rpc\("yarper_start_game"/);
  assert.match(source, /ROUND_ALREADY_WAITING/);
  assert.match(source, /NOT_YOUR_TURN/);
});
