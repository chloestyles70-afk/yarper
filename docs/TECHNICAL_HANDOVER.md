# Yarper — Technical Handover

## Components

| Component | Current implementation |
| --- | --- |
| Web client | Static single-page app: `index.html` |
| Sync scheduler | `sync-scheduler.js` |
| Automated tests | `tests/*.test.cjs` |
| Backend source | `supabase/functions/yarper-api/index.ts` |
| Supabase CLI configuration | `supabase/config.toml` |
| Hosting | Vercel project `yarper` |
| Backend | Supabase Edge Function `yarper-api`, Deno runtime; version 23 reported ACTIVE on 4 Nov 2026 |
| Database | Supabase PostgreSQL 17 |

## Repository and migration status

The repository contains the static frontend, Edge Function source/configuration, scheduler, app manifest, SVG icon, tests, documentation and all 16 migration files recorded in live Supabase migration history. Each repository migration was compared with its stored live SQL statement; the SQL contents match. A clean-room database rebuild from repository source has not yet been proven.

Most HTML, CSS and browser application logic remains in `index.html`. This is deployable as a static site but increases maintenance and testing effort.

## Database model

Public application tables:
- `yarper_couples`: invite-code-based couple spaces.
- `yarper_members`: two device/member identities per couple; stores a device-token hash, not the raw device token.
- `yarper_state`: XP, rounds, streak, turn state and daily quest state.
- `yarper_game_sessions`: prompt rounds and answers.
- `yarper_reactions`: emoji reactions linked to a round.

Private schema: `private.yarper_rate_limits`, used for request-rate-limit buckets.

Foreign keys from members, game sessions, reactions and state to a couple use ON DELETE CASCADE. Reactions also cascade when a game session is deleted. A disposable-data SQL smoke test confirmed that deleting a couple removes members, state, sessions and reactions.

## Backend authentication and security design

The deployed Edge Function has Supabase JWT verification disabled and uses a custom device-token header. The function hashes the submitted token with SHA-256 and looks up the matching member record. The raw device token is generated with cryptographic randomness and returned only during create/join. The SHA-256 hash is stored in the member row.

Each member row has token expiry and revocation state. Tokens expire after 30 days without a successful `me`/heartbeat request; those requests extend idle expiry. The Settings reset action calls `revoke_session` before clearing the active token. The previous device token is preserved in localStorage as a recovery credential. Reclaiming an expired/revoked slot requires the room code, matching display name and proof of possession of the previous device token. A new token hash replaces the old one. Clearing browser site data removes the recovery credential and prevents automatic recovery.

The production Edge Function reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from server-side environment variables. Never put the service-role key in browser code or the source repository.

Reviewed SECURITY DEFINER RPCs use explicit `search_path` settings. Live ACL checks confirmed `anon=false`, `authenticated=false` and `service_role=true` for reviewed join, cleanup and rate-limit RPCs. The five public application tables have RLS enabled and no direct anon/authenticated table grants were observed. Recheck after future migrations.

## Room deletion and rate-limit cleanup

An authenticated member can permanently delete the entire couple space from Settings by entering the six-character room code. This removes both members' access and linked answers, reactions and progress. The UI warns that the partner also loses access.

pg_cron 1.6.4 is installed. The active `yarper-rate-limit-cleanup` job runs daily at 03:15 and removes rate-limit bucket rows older than seven days. It does not delete room content. Authenticated `me`, heartbeat and snapshot requests are limited to 90 per member per five-minute window.

No automatic retention period is implemented for abandoned couple-room content.

## Browser security and frontend observations

- Active and recovery bearer tokens are stored in browser localStorage. This remains an XSS exposure; consider an HttpOnly, Secure, SameSite session design or another approach that keeps secrets out of page JavaScript.
- User-controlled strings are escaped in reviewed dynamic HTML rendering paths; plain text is inserted with `textContent` elsewhere.
- The answer form warns users not to submit passwords, financial details or highly sensitive personal information.
- `vercel.json` defines CSP, HSTS, frame protection, MIME-sniffing protection, Referrer-Policy, Permissions-Policy and Cross-Origin-Opener-Policy. CSP allows inline scripts/styles to accommodate the current frontend. Verify actual production response headers with a direct HTTP request.
- Supabase JS SDK import is pinned to 2.118.0 (MIT).
- A six-character room code is an invitation secret, not account-grade identity verification.

## Live database and advisor observations

- Supabase project status: ACTIVE_HEALTHY in the 4 Nov 2026 review.
- Database region: eu-west-1.
- 16 migration records reported by Supabase on 4 November 2026.
- RLS enabled on all five public application tables; no direct anon/authenticated table grants found for those tables.
- Supabase security advisor reported five informational RLS-enabled-without-policy findings consistent with server-mediated access.
- Supabase performance advisor reported three informational unused-index findings. No indexes were removed.
- No formal penetration test, privacy compliance audit or third-party asset-rights audit has been completed.

## Backup and restore

The Supabase organization is on the Free plan. Do not assume automated daily backups are enabled. The repository includes `scripts/backup-supabase.sh` and `docs/BACKUP_RESTORE_RUNBOOK.md` for an encrypted CLI export of roles, schema and data. The hardened script's shell syntax and mocked export/encryption/checksum flow passed. It has not been run against production because a private database connection string and encryption recipient are required. No production backup or restore drill has been completed. Keep backups encrypted and off-site; never commit SQL dumps.

## Dependency inventory and buyer handover

See `docs/DEPENDENCY_INVENTORY.md` for the direct-source inventory and limitations. A complete resolved transitive SBOM and license review remain outstanding. See `docs/BUYER_HANDOVER_CHECKLIST.md` for the controlled account, database, deployment and acceptance sequence.

## Deployment and credentials

The latest recorded Vercel production deployment for the merged hardening changes was READY and aliases included `yarper.vercel.app`. Supabase Edge Function `yarper-api` was reported ACTIVE at version 23.

Before transfer:
1. Confirm buyer-controlled Vercel and Supabase organizations/accounts.
2. Confirm domain ownership and provider transfer rules.
3. Transfer project/repository ownership using supported provider workflows where possible.
4. Rotate all secrets and integration tokens; never transfer the seller's personal login.
5. Verify the buyer can deploy the frontend and backend from their own accounts.
6. Verify production create/join/game/reward/delete flows on a buyer-controlled test couple.
7. Verify the buyer can restore the database from a documented backup and understands the migration procedure.

## Data handling and legal documents

The application stores display names, room codes, device/session metadata, presence timestamps, prompts/answers, reactions and gameplay state. The Supabase database was observed in eu-west-1; the current Vercel deployment reported region iad1. These facts do not establish all provider log, backup or subprocessor locations.

Privacy Notice and Terms drafts are in `docs/PRIVACY_POLICY_DRAFT.md` and `docs/TERMS_OF_SERVICE_DRAFT.md`. They are not published or linked in the app. They require operator legal identity/contact, launch jurisdictions, minimum age, abandoned-room retention period, provider processing details and legal review.

Before transfer, classify existing database rows as test/demo or real user data. Do not publish raw database exports in the sales listing. Document lawful retention, deletion, consent and transfer arrangements.

## Frontend synchronization and tests

The scheduler is configured for 5-second sync while visible/online, 15-second retry while visible/offline, and no background polling while hidden. It refreshes on visibility, focus, page-show and network-status events.

Run checked-in unit tests with `npm test`. The current suite contains 28 Node regression tests covering selected frontend syntax, session policy, scheduler timing and security/privacy regression checks. It is not a full functional or security suite.
