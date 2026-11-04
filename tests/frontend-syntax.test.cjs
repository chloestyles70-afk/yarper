const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('the main inline application script parses as JavaScript', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length > 0, 'index.html should contain an application script');
  const appScript = scripts[scripts.length - 1][1];
  assert.doesNotThrow(() => new vm.Script(appScript, { filename: 'index.html inline script' }));
});
