# Yarper Functional and Release Test Plan

**Purpose:** Define repeatable acceptance checks before a Flippa listing or buyer handover.

**Status:** Test plan prepared; the full suite has NOT yet been executed as part of this review.

## Test environment

- Use a buyer-safe staging deployment where possible.
- Use two separate browsers/devices and two fresh test accounts.
- Do not use real couples' data or production records for destructive tests.
- Record date, browser/device, build commit, expected result, actual result and evidence for each test.
- Remove test records after testing, subject to the backend's supported deletion process.

## Core end-to-end scenarios

1. **Create a room:** Player 1 enters a display name and creates a room. A valid six-character invite code and device session are returned.
2. **Join a room:** Player 2 enters the exact invite code from a separate device. Both players see the same room and correct player identities.
3. **Invalid join:** Incorrect, malformed, expired or already-full room codes return a safe, understandable error and do not create an unintended member.
4. **Reconnect:** Reload each device and verify that valid sessions restore the correct room and player identity.
5. **Presence:** Verify online/offline state changes when a player closes, backgrounds, reconnects or loses network access.
6. **Prompt selection:** The active player can select a prompt from every supported category; the other player receives the same prompt.
7. **Answer submission:** The responding player can submit one answer; empty answers are rejected; the answer is shown to the intended room only.
8. **Turn progression:** The next player is selected correctly and only one waiting round exists per room.
9. **Reactions:** Supported reactions are saved and displayed to both participants; invalid values are rejected server-side.
10. **XP and levels:** XP changes only for eligible actions; level progression and celebration match server state.
11. **Daily quest:** A completed daily quest cannot be claimed twice for the same day.
12. **Streak reward:** Concurrent or repeated claims cannot award the same streak reward more than once.
13. **Duplicate requests:** Repeat and concurrent requests for join, answer, round creation and reward claims do not create duplicate state or rewards.
14. **Network interruption:** Offline state is visible or recoverable; reconnect triggers a fresh sync without duplicate actions.
15. **Session lifecycle:** Verify a session expires after 30 days without heartbeat; successful heartbeat extends expiry; reset calls server-side revocation before clearing localStorage; a revoked token cannot access any action; a failed revoke leaves the browser token intact; expired/revoked recovery with the same room code and exact display name replaces the old token hash; old token then fails.
16. **Mobile layout:** Test narrow screens, safe areas, keyboard overlays, scrolling, dialogs and touch targets.
17. **Accessibility basics:** Keyboard focus is visible, controls have accessible names, reduced-motion preference is respected and text remains readable at zoom.
18. **Data deletion:** Confirm the owner can export or delete a room and its related personal data in accordance with the published privacy terms.

## Security and abuse checks

- Attempt unauthenticated and invalid-token requests against every backend action.
- Verify a member cannot read or mutate another room by changing IDs or invite codes.
- Verify server-side validation for names, prompt categories, answers, reactions, payload sizes and request rates.
- Test invite-code guessing resistance and rate limiting.
- Confirm no service-role secret or database credential is present in browser assets, repository history, build output or logs.
- Check XSS payloads in display names, answers, reactions and all user-controlled text.
- Verify CORS is restricted to intended origins where practical; do not treat CORS as authentication.
- Verify logs do not contain raw session tokens, private answers or unnecessary personal data.

## Evidence required for buyer claims

A claim such as “all core flows tested” requires a dated test record with pass/fail outcomes. A claim such as “secure” or “bug-free” requires a suitably scoped independent assessment and must not be inferred from unit tests alone.
