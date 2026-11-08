const test = require('node:test');
const assert = require('node:assert/strict');

const policy = () => import('../supabase/functions/yarper-custom-questions/policy.mjs');

const player1 = { id: 'member-one', couple_id: 'couple-a' };
const player2 = { id: 'member-two', couple_id: 'couple-a' };

test('private questions can only be selected by their creator and are sent to the partner', async () => {
  const { isCustomQuestionEligible } = await policy();
  const question = { couple_id: 'couple-a', game_mode: 'questions', visibility: 'private', creator_member_id: player1.id };
  assert.equal(isCustomQuestionEligible(question, player1, 'questions'), true);
  assert.equal(isCustomQuestionEligible(question, player2, 'questions'), false);
});

test('shared questions are eligible for both partners', async () => {
  const { isCustomQuestionEligible } = await policy();
  const question = { couple_id: 'couple-a', game_mode: 'questions', visibility: 'shared', creator_member_id: player1.id };
  assert.equal(isCustomQuestionEligible(question, player1, 'questions'), true);
  assert.equal(isCustomQuestionEligible(question, player2, 'questions'), true);
});

test('questions cannot cross couple boundaries or game categories', async () => {
  const { isCustomQuestionEligible } = await policy();
  const question = { couple_id: 'couple-a', game_mode: 'questions', visibility: 'shared', creator_member_id: player1.id };
  assert.equal(isCustomQuestionEligible(question, { id: 'other', couple_id: 'couple-b' }, 'questions'), false);
  assert.equal(isCustomQuestionEligible(question, player2, 'truth'), false);
});

test('only the creator can manage their own question', async () => {
  const { canManageCustomQuestion } = await policy();
  const question = { id: 'q1', couple_id: 'couple-a', creator_member_id: player1.id };
  assert.equal(canManageCustomQuestion(question, player1), true);
  assert.equal(canManageCustomQuestion(question, player2), false);
  assert.equal(canManageCustomQuestion(question, { id: 'other', couple_id: 'couple-b' }), false);
});

test('question text is trimmed and validated', async () => {
  const { cleanCustomQuestion } = await policy();
  assert.equal(cleanCustomQuestion('  What makes you smile?  '), 'What makes you smile?');
  assert.throws(() => cleanCustomQuestion('no'), /between 5 and 240/);
  assert.throws(() => cleanCustomQuestion('x'.repeat(241)), /between 5 and 240/);
});

test('custom-question sessions expire and revoked sessions are rejected', async () => {
  const { isSessionActive } = await policy();
  const now = Date.parse('2026-11-08T12:00:00.000Z');
  assert.equal(isSessionActive('2026-11-09T12:00:00.000Z', null, now), true);
  assert.equal(isSessionActive('2026-11-08T12:00:00.000Z', null, now), false);
  assert.equal(isSessionActive('2026-11-09T12:00:00.000Z', '2026-11-07T12:00:00.000Z', now), false);
});

test('custom-question CORS allows production and this project preview deployments only', async () => {
  const { isAllowedCustomQuestionOrigin } = await policy();
  assert.equal(isAllowedCustomQuestionOrigin('https://yarper.vercel.app'), true);
  assert.equal(isAllowedCustomQuestionOrigin('https://yarper-dmk7082oi-chloestyles70-8029.vercel.app'), true);
  assert.equal(isAllowedCustomQuestionOrigin('https://yarper-another-preview-chloestyles70-8029.vercel.app'), true);
  assert.equal(isAllowedCustomQuestionOrigin('https://evil-yarper-dmk7082oi-chloestyles70-8029.vercel.app'), false);
  assert.equal(isAllowedCustomQuestionOrigin('https://yarper.vercel.app.evil.example'), false);
  assert.equal(isAllowedCustomQuestionOrigin('http://yarper-dmk7082oi-chloestyles70-8029.vercel.app'), false);
});
