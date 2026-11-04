# Yarper — Verification Results

**Verification date:** 4 November 2026

## Passed checks

| Check | Result | Scope |
|---|---|---|
| Scheduler unit tests | PASS — 3 passed, 0 failed | Visible/online 5-second interval, hidden-tab pause, visible/offline 15-second retry. |
| Scheduler syntax check | PASS | Node.js syntax check of sync-scheduler.js. |
| Production rate-limit smoke test | PASS | Called consume_yarper_rate_limit with advance_game and a temporary unique test key; it returned true. The test bucket was deleted immediately after. |
| Rate-limit function privileges | PASS | anon and authenticated cannot execute; service_role can execute. |
| Table grants review | PASS for intended server-mediated pattern | The inspected Yarper tables showed service_role grants and no direct anon/authenticated table grants. |
| RLS status | PASS for enabled status | RLS enabled on all five public application tables. This does not replace review of server-side authorization. |
| GitHub Actions | PASS on the inspected readiness-branch commits | Workflow runs completed successfully for the commits checked before the final documentation updates; recheck the latest pull-request run before merging. |

## Advisor findings

- Five informational RLS-enabled-without-policy notices on the five public tables.
- Four informational unused-index notices.
- No indexes were dropped. No broad client-facing RLS policies were added.

## Not yet tested

- Full two-device create/join/game/answer/advance/reward regression.
- Cross-room authorization and invite-code brute-force resistance.
- Custom token expiry, revocation and replay behavior.
- XSS, CSP, CORS and request-payload abuse testing.
- Independent penetration test.
- Privacy/data deletion workflows.
- Clean-room frontend and backend deployment from the repository.
- Full database restore from a documented backup.

The passing checks above are narrow and must not be described as proof that Yarper is bug-free, fully secure or independently certified.
