const test = require('node:test');
const assert = require('node:assert/strict');

test('new sessions receive a 30-day idle expiry', async () => {
  const { SESSION_TTL_MS, getSessionExpiry } = await import('../supabase/functions/yarper-api/session-policy.mjs');
  const now = Date.parse('2026-11-04T12:00:00.000Z');
  assert.equal(SESSION_TTL_MS, 30 * 24 * 60 * 60 * 1000);
  assert.equal(getSessionExpiry(now), '2026-12-04T12:00:00.000Z');
});

test('a session is active only before expiry and while not revoked', async () => {
  const { isSessionActive } = await import('../supabase/functions/yarper-api/session-policy.mjs');
  const now = Date.parse('2026-11-04T12:00:00.000Z');
  assert.equal(isSessionActive('2026-11-05T12:00:00.000Z', null, now), true);
  assert.equal(isSessionActive('2026-11-04T12:00:00.000Z', null, now), false);
  assert.equal(isSessionActive('2026-11-05T12:00:00.000Z', '2026-11-03T12:00:00.000Z', now), false);
  assert.equal(isSessionActive('not-a-date', null, now), false);
});
