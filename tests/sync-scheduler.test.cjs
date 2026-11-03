const test = require('node:test');
const assert = require('node:assert/strict');
const { getSyncDelay } = require('../sync-scheduler.js');

test('visible online tabs sync every five seconds', () => {
  assert.equal(getSyncDelay({ hidden: false, online: true }), 5000);
});

test('hidden tabs stop background polling', () => {
  assert.equal(getSyncDelay({ hidden: true, online: true }), null);
});

test('offline tabs retry less frequently', () => {
  assert.equal(getSyncDelay({ hidden: false, online: false }), 15000);
});
