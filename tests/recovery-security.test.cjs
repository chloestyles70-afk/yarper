const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('expired or revoked member recovery requires possession of the previous device secret', () => {
  const migrationDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migration = fs.readdirSync(migrationDir)
    .filter(name => name.endsWith('.sql'))
    .sort()
    .map(name => fs.readFileSync(path.join(migrationDir, name), 'utf8'))
    .join('\n');
  assert.match(migration, /p_recovery_token_hash\s+text/i);
  assert.match(migration, /device_token_hash\s*=\s*p_recovery_token_hash/i);
  assert.match(migration, /COUPLE_FULL/i);
  assert.doesNotMatch(migration, /AND\s+m\.display_name\s*=\s*btrim\(p_display_name\)[\s\S]{0,300}IF FOUND THEN\s+UPDATE/i);
});

test('frontend preserves the recovery secret across session reset and sends it only on join', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /yarperRecoveryToken/);
  assert.match(html, /x-yarper-recovery-token/);
  assert.match(html, /localStorage\.setItem\(["']yarperRecoveryToken["']/);
});
