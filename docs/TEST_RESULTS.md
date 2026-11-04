# Yarper — Verification Results

**Verification date:** 4 November 2026

## Passed checks

| Check | Result | Scope |
|---|---|---|
| Scheduler unit tests | PASS — 3 passed, 0 failed | Visible/online 5-second interval, hidden-tab pause, visible/offline 15-second retry. |
| Session-policy unit tests | PASS — 2 passed, 0 failed | 30-day idle expiry calculation; active, expired, revoked and invalid-expiry states. |
| Frontend JavaScript syntax test | PASS on GitHub Actions run 41859441306 | Parses the final inline application script in index.html. |
| Local combined Node test run | PASS — 5 passed, 0 failed | Existing scheduler tests plus new session-policy tests. |
| Production SQL session-recovery smoke test | PASS | Expired and revoked test member rows were reclaimed only with the same display name; token hash was replaced, expiry renewed and revocation cleared. Temporary test couple was deleted. |
| Rate-limit smoke test | PASS | advance_game action accepted by consume_yarper_rate_limit; temporary test bucket deleted. |
| Rate-limit function privileges | PASS | anon and authenticated cannot execute; service_role can execute. |
| Join RPC privileges | PASS | anon and authenticated cannot execute; service_role can execute. |
| Table grants review | PASS for intended server-mediated pattern | The inspected Yarper tables showed service_role grants and no direct anon/authenticated table grants. |
| RLS status | PASS for enabled status | RLS enabled on all five public application tables. This does not replace review of server-side authorization. |
| Supabase Edge Function deployment | PASS — version 19 ACTIVE | Deployed with session expiry checks, token refresh and server-side revocation action. |
| GitHub Actions | PASS on several earlier commits; latest post-fix run pending | Workflow includes scheduler tests, session-policy tests and frontend script syntax validation. |

## Session lifecycle implementation

- New member sessions receive a 30-day idle expiry.
- Successful `me` and heartbeat requests extend the expiry by another 30 days.
- The Edge Function rejects expired or revoked device tokens.
- The Settings reset action calls `revoke_session` before clearing browser storage.
- If server-side revocation fails, the UI does not clear the token; it asks the user to retry.
- Expired/revoked member slots can be reclaimed with the couple code and the exact existing display name. The join RPC replaces the old token hash, so the old credential no longer authenticates.
- The live database migration and deployed Edge Function are in place.

## Advisor findings

- Five informational RLS-enabled-without-policy notices on the five public tables.
- Four informational unused-index notices.
- No indexes were dropped. No broad client-facing RLS policies were added.

## Not yet tested

- Full two-device create/join/game/answer/advance/reward regression.
- End-to-end browser test of reset button against the live deployed frontend and Edge Function.
- Cross-room authorization and invite-code brute-force resistance.
- Token replay and recovery abuse testing by an independent reviewer.
- XSS, CSP, CORS and request-payload abuse testing.
- Independent penetration test.
- Privacy/data deletion workflows.
- Clean-room frontend and backend deployment from the repository.
- Full database restore from a documented backup.

The passing checks above are narrow and must not be described as proof that Yarper is bug-free, fully secure or independently certified.
