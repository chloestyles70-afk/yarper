const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('the production HTML escaping helper neutralizes common XSS payloads', () => {
  const start = html.indexOf('function esc(v){');
  const end = html.indexOf('async function api(', start);
  assert.notEqual(start, -1, 'esc helper must exist');
  assert.notEqual(end, -1, 'esc helper must precede API client');
  const source = html.slice(start, end).trim();
  const esc = vm.runInNewContext(`${source}; esc`);
  const payloads = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '\" autofocus onfocus=\"alert(1)',
    "'><svg onload=alert(1)>",
    '</textarea><script>alert(document.domain)</script>',
    '&lt;script&gt;'
  ];
  for (const payload of payloads) {
    const escaped = esc(payload);
    assert.doesNotMatch(escaped, /<|>|(?<!&)(?:javascript:)/i, `payload remained markup-capable: ${payload}`);
    assert.match(escaped, /&lt;|&gt;|&amp;|&quot;|&#39;/);
  }
});

test('API-controlled strings are escaped before insertion into HTML string sinks', () => {
  const sinks = [...html.matchAll(/([A-Za-z_$][\w$]*|\$\("[^"]+"\))\.innerHTML\s*=/g)].map(m => m.index);
  assert.ok(sinks.length > 0, 'expected known HTML rendering sinks');
  const source = sinks.map(i => html.slice(i, Math.min(html.length, i + 1500))).join('\n---SINK---\n');
  for (const field of ['x.question', 'g.question', 'g.answer', 'chooser', 'q', 'v']) {
    assert.ok(source.includes(`esc(${field})`), `missing escaping for ${field}`);
  }
  assert.ok(source.includes('esc((x.game_mode||"GAME").toUpperCase())'));
  assert.ok(source.includes('esc(r.emoji)'));
});

test('the production and prototype pages do not use high-risk HTML/script execution APIs', () => {
  for (const file of ['index.html', 'concept/index.html', 'studio/index.html']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /\b(?:eval|new Function)\s*\(/);
    assert.doesNotMatch(source, /\bdocument\.write\s*\(/);
    assert.doesNotMatch(source, /insertAdjacentHTML\s*\(/);
    assert.doesNotMatch(source, /\bsrcdoc\s*=/i);
  }
});
