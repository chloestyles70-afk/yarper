const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('expired or revoked member recovery requires possession of the previous device secret', () => {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261104160000_secure_member_recovery.sql');
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
