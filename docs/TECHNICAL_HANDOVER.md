# Yarper — Technical Handover

## Components

| Component | Current implementation |
| --- | --- |
| Web client | Static single-page app: index.html |
| Sync scheduler | sync-scheduler.js |
| Automated unit tests | tests/sync-scheduler.test.cjs |
| Backend source | supabase/functions/yarper-api/index.ts |
| Supabase CLI configuration | supabase/config.toml |
| Hosting | Vercel project yarper |
| Data/API | Supabase project Yarper |
| Backend function | yarper-api, Deno Edge Function |
| Database | PostgreSQL 17 |

## Repository boundary

The GitHub repository contains the static frontend, deployed Edge Function source, function configuration, scheduler, one scheduler unit-test file, app manifest, SVG icon and documentation. The live database migration history contains 13 entries after the session-expiry and revocation migration, but only the latest corrective migration is currently represented in the repository. Export and reconcile the complete historical migration set before claiming the repository can recreate the production database from scratch.

The frontend currently concentrates its HTML, CSS and application JavaScript in index.html. This is deployable as a static site, but its monolithic structure and limited automated test coverage increase the effort required for future maintenance.

## Database model

The current project inspection identified these public application tables:

- yarper_couples: invite-code-based couple spaces.
- yarper_members: two device/member identities per couple; stores a device token hash, not the raw device token.
- yarper_state: XP, rounds, streak, turn state and daily quest state.
- yarper_game_sessions: prompt rounds and answers.
- yarper_reactions: emoji reactions linked to a round.

Private schema:
- private.yarper_rate_limits: request-rate-limit buckets.

The live database also contains unique constraints, foreign keys and check constraints. Obtain a complete schema export and reconcile it with migration files before handover.

## Backend authentication and security design

The deployed Edge Function has Supabase JWT verification disabled and uses a custom device-token header. The function hashes the submitted token with SHA-256 and looks up the matching member record. The raw device token is generated with cryptographic randomness and returned only during create/join. The SHA-256 hash is stored in the member row. Each member row has `token_expires_at` and `token_revoked_at`. Tokens expire after 30 days without a successful `me`/heartbeat request; those requests extend the idle expiry. The Settings reset action calls `revoke_session`, which marks the server-side token revoked before clearing browser storage. If revocation fails, the browser retains the token and asks the user to retry. Expired/revoked slots can be reclaimed by joining with the couple code and the exact existing display name; the RPC replaces the old token hash. The Edge Function deployment was updated to version 20. This is a custom authentication system and still requires independent review.

The Edge Function reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from server-side environment variables. Never put the service-role key in the browser or source repository.

The database functions that use SECURITY DEFINER have an explicit search_path and, in the inspected ACLs, EXECUTE was granted to service_role rather than PUBLIC, anon or authenticated. The live grant check confirmed that anon and authenticated cannot execute the rate-limit function, while service_role can. Recheck grants after future migrations.

## Rate limiting correction — 4 November 2026

A source-to-database mismatch was found: the Edge Function applied a rate limit to advance_game, but the SQL allow-list in consume_yarper_rate_limit omitted that action. As a result, the rate-limit RPC rejected advance_game requests. A corrective migration named allow_advance_game_rate_limit was applied to the live project, and a smoke test confirmed the action is accepted. The migration is recorded in supabase/migrations/20261104152425_allow_advance_game_rate_limit.sql. The smoke-test row was deleted after verification.

## Frontend observations

- The browser sends requests to a Supabase Edge Function endpoint.
- A per-device session token is stored in localStorage and sent in a custom request header.
- Dynamic user-controlled strings inspected in the current frontend rendering paths are escaped before insertion into HTML.
- The frontend uses a single inline application script and inline style block. Review deployed response headers and establish a compatible Content Security Policy; do not apply a restrictive policy without testing the inline assets.
- localStorage is accessible to scripts running on the origin. A complete XSS and token-handling review is still required.

## Database access and advisor observations

- RLS is enabled on all five public application tables.
- The inspected table grant listing showed service_role privileges; no direct anon/authenticated table grants were present for the Yarper tables.
- Supabase security advisor reported five informational rls_enabled_no_policy findings.
- Supabase performance advisor reported four informational unused_index findings.
- No indexes were removed: the small observed dataset is insufficient evidence that these indexes are unnecessary.
- No formal penetration test, privacy compliance audit or third-party dependency/licence audit has been completed.

## Deployment and credentials

The Supabase project was ACTIVE_HEALTHY and the Edge Function was ACTIVE at version 20 after the session-lifecycle update on 4 November 2026. Recheck current deployment status and ownership before transfer.

Before transfer:
1. Confirm buyer-controlled Vercel and Supabase organizations/accounts.
2. Confirm domain ownership and provider transfer rules.
3. Transfer project/repository ownership using supported provider workflows where possible.
4. Rotate all secrets and integration tokens; never transfer the seller's personal login.
5. Verify the buyer can deploy the frontend and backend from their own accounts.
6. Verify production create/join/game/reward flows on a buyer-controlled test couple.
7. Confirm the buyer can restore the database from a documented backup and understands the migration procedure.

## Data handling

The live database inspection observed 9 couple rows, 18 member rows, 9 state rows, 11 game-session rows and 13 reaction rows. These counts do not establish real users or active usage. The contents and ownership of the records must be classified as test/demo or real user data. Do not publish raw database exports in the sales listing. Before transfer, document lawful retention, deletion, consent and transfer arrangements.

## Frontend synchronization

The scheduler is configured for:
- 5-second sync while visible and online.
- 15-second retry while visible and offline.
- No background polling while the tab is hidden.
- Scheduler refresh on visibility, focus, page-show and network-status events.

Run the checked-in unit tests with npm test. They cover only the scheduler timing behavior and are not a full functional or security suite.
