const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function functionBody(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Expected ${name} to exist`);
  const next = html.indexOf('\nfunction ', start + 1);
  const nextAsync = html.indexOf('\nasync function ', start + 1);
  const ends = [next, nextAsync].filter(index => index !== -1);
  return html.slice(start, ends.length ? Math.min(...ends) : html.length);
}

test('connecting during create or join keeps the onboarding success screen visible', () => {
  const apply = functionBody('apply');
  assert.match(
    apply,
    /state\.connected&&!unlocked&&\$\("gateForm"\)\.classList\.contains\("hidden"\)/,
    'apply must not auto-dismiss the gate while the create/join form is active'
  );
});

test('copy couple code handles unavailable or denied clipboard access with a manual-copy fallback', () => {
  const copyCode = functionBody('copyCode');
  assert.match(copyCode, /navigator\.clipboard/);
  assert.match(copyCode, /catch\s*\(/, 'clipboard rejection must be handled');
  assert.match(copyCode, /createRange\(\)|selectNodeContents\(\$\("profileCode"\)\)/);
  assert.match(copyCode, /copy it manually|select.*copy/i);
});
