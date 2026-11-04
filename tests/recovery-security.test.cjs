const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('expired or revoked member recovery requires possession of the previous device secret', () => {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261104155915_secure_member_recovery_and_retention.sql');
  const migration = fs.readFileSync(migrationPath, 'utf8');
  assert.match(migration, /p_recovery_token_hash\s+text/i);
  assert.match(migration, /v_member\.device_token_hash\s*<>\s*p_recovery_token_hash/i);
  assert.match(migration, /RAISE EXCEPTION 'COUPLE_FULL'/i);
  assert.match(migration, /REVOKE ALL ON FUNCTION public\.join_yarper_couple\(text, text, text, text\) FROM PUBLIC, anon, authenticated/i);
});

test('frontend preserves the recovery secret across session reset and sends it only on join', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /yarperRecoveryToken/);
  assert.match(html, /x-yarper-recovery-token/);
  assert.match(html, /localStorage\.setItem\(["']yarperRecoveryToken["']/);
  assert.match(html, /localStorage\.setItem\(["']yarperDisplayName["']/);
});

test('room deletion requires an authenticated member and a matching room code', () => {
  const api = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'functions', 'yarper-api', 'index.ts'), 'utf8');
  assert.match(api, /if\(action==="delete_room"\)[\s\S]*?member\.couple_id[\s\S]*?room\.data\.code!==confirmation[\s\S]*?from\("yarper_couples"\)\.delete\(\)/);
  assert.match(api, /delete_room:\{limit:2,windowSeconds:3600\}/);
});

test('the frontend applies a restrictive security-header configuration and the backend SDK is pinned', () => {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
  const headers = config.headers[0].headers;
  const csp = headers.find(h => h.key === 'Content-Security-Policy')?.value || '';
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  const api = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'functions', 'yarper-api', 'index.ts'), 'utf8');
  assert.match(api, /@supabase\/supabase-js@2\.118\.0/);
  assert.doesNotMatch(api, /@supabase\/supabase-js@2["']/);
});

test('rate-limit bucket retention cleanup is scheduled and limited to abuse metadata', () => {
  const migration = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '20261104155915_secure_member_recovery_and_retention.sql'), 'utf8');
  assert.ok(migration.includes('DELETE FROM private.yarper_rate_limits'));
  assert.ok(migration.includes("window_start < now() - interval '7 days'"));
  assert.ok(migration.includes("'15 3 * * *'"));
  assert.ok(!/DELETE FROM public\.yarper_(couples|members|game_sessions|reactions|state)/i.test(migration));
});

test('transient boot failures preserve a valid session instead of forcing recovery', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /catch\(e\)\{if\(\/expired\|revoked\|session\/i\.test\(e\.message\)\)/);
  assert.match(html, /Could not reconnect\. Check your connection and reload\./);
});

test('free-text answers include a warning against submitting sensitive personal information', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /Avoid sharing passwords, financial details or highly sensitive personal information/);
});

test('authenticated sync and snapshot actions are rate-limited without breaking normal polling', () => {
  const api = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'functions', 'yarper-api', 'index.ts'), 'utf8');
  assert.match(api, /me:\{limit:90,windowSeconds:300\}/);
  assert.match(api, /heartbeat:\{limit:90,windowSeconds:300\}/);
  assert.match(api, /snapshot:\{limit:90,windowSeconds:300\}/);
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrations = fs.readdirSync(migrationsDir).filter(name => name.endsWith('.sql')).sort()
    .map(name => fs.readFileSync(path.join(migrationsDir, name), 'utf8')).join('\n');
  assert.match(migrations, /p_action NOT IN[\s\S]*'me','heartbeat','snapshot'/);
});
