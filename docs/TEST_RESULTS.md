# Yarper — Verification Results

**Verification date:** 4 November 2026

## Passed checks

| Check | Result | Scope |
|---|---|---|
| Node 22 automated suite | PASS — 14 passed, 0 failed | Run in an isolated Vercel Node 22 sandbox using the current repository test files. Covers frontend inline-script syntax, session policy, scheduler behavior, secure recovery guards, transient boot failure handling, room deletion checks, security-header configuration, dependency pinning and rate-limit cleanup policy. |
| Production recovery SQL smoke test | PASS | Missing and wrong previous-device proof rejected; correct previous token hash accepted; member ID preserved; new token hash installed; revocation cleared; old hash absent. Disposable test couple deleted. |
| Normal second-player join SQL smoke test | PASS | New member can join a one-member room without a recovery credential. Disposable test couple deleted. |
| Whole-room deletion cascade SQL smoke test | PASS | Disposable couple deletion cascaded through members, state, game sessions and reactions; no related rows remained. |
| Rate-limit cleanup SQL smoke test | PASS | Eight-day-old test bucket was removed by cleanup function. |
| Scheduled cleanup configuration | PASS | pg_cron 1.6.4 installed; active job yarper-rate-limit-cleanup scheduled daily at 03:15. |
| Authenticated sync rate limits | PASS | me, heartbeat and snapshot are limited to 90 requests per member per five-minute window; SQL smoke test confirmed first requests pass and heartbeat request 91 is rejected. Temporary test rows deleted. |
| Function privileges | PASS | join_yarper_couple, cleanup_yarper_rate_limits and consume_yarper_rate_limit: anon=false, authenticated=false, service_role=true. |
| Table grants and RLS | PASS for intended server-mediated model | RLS enabled on all five public application tables; no direct anon/authenticated table grants found. |
| Supabase Edge Function deployment | PASS — version 22 ACTIVE | Custom device-token authentication and secure recovery header deployed. verify_jwt=false is intentional for this custom auth model. |
| Vercel production deployment | PASS — READY | Merged main-branch deployment is READY; alias yarper.vercel.app verified. |
| Vercel runtime errors | PASS for selected recent window | Vercel returned no runtime errors in the selected one-hour window. |
| Prior owner-confirmed functional checks | PASS, user-confirmed | Earlier two-device gameplay regression and reset/session recovery were confirmed by the owner. Not independently witnessed in this run. |

## Session lifecycle and recovery

- New member sessions receive a 30-day idle expiry.
- Successful me and heartbeat requests extend expiry by 30 days.
- The Edge Function rejects expired or revoked device tokens.
- Settings reset revokes the server-side token before clearing the active token.
- The previous token is preserved as a recovery credential in that browser.
- Reclaiming an expired/revoked slot requires the previous device-token proof, room code and matching display name.
- The recovery RPC rotates the stored token hash; the old token no longer matches.
- If the user clears browser site data and loses the recovery credential, automatic recovery is not available.

## Live migration history

Supabase reports 15 applied migrations. All 15 corresponding migration files are now in the repository and their SQL was compared with the live stored statements; contents match. The two latest security migrations are 20261104155915 (secure member recovery and rate-limit cleanup) and 20261104160725 (authenticated sync endpoint rate limits). A clean-room rebuild is still pending.

## Advisor findings

- Five informational RLS-enabled-without-policy notices on the five public application tables. This is consistent with the server-mediated access model only while direct client grants remain absent and the Edge Function correctly authorizes every action.
- Three informational unused-index notices. No indexes were dropped.

- Backup script shell syntax: PASS — bash -n scripts/backup-supabase.sh. The script was not run against production because the private database URL and encryption recipient are not available in this environment.\n\n## Still not independently tested

- Direct production HTTP verification of response security headers.
- Browser-based XSS payload checks against display names, prompts, answers and reactions.
- Cross-room authorization and token replay attacks.
- Invite-code brute-force resistance under realistic distributed traffic.
- Full latest-build two-device create/join/game/answer/advance/reward/delete E2E.
- Independent penetration test.
- Provider backup/log deletion behavior and privacy rights request workflow.
- Clean-room frontend/backend deployment from the repository.
- Full database restore from a documented backup.

The passing checks above are narrow. They do not prove Yarper is bug-free, fully secure, penetration-tested or independently certified.
