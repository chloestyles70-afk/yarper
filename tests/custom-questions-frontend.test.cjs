const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'custom-questions.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('custom question browser module is valid JavaScript', () => {
  assert.doesNotThrow(() => new Function(script));
});

test('custom question controls are available from the dashboard and game modal', () => {
  assert.match(html, /custom-questions\.css/);
  assert.match(html, /custom-questions\.js/);
  assert.match(html, /Create and manage your own questions/);
  assert.match(html, /id="customQuestionsModal"/);
  assert.match(html, /openCustomQuestions\(true\)/);
});

test('custom gameplay supports both selection modes and uses the existing round API', () => {
  assert.match(script, /Mixed Mode/);
  assert.match(script, /Custom Only/);
  assert.match(script, /api\("start_game", \{ mode, question \}\)/);
  assert.match(script, /yarper-custom-questions/);
});
