# Yarper — Technical Handover

## Components

| Component | Current implementation |
| --- | --- |
| Web client | Static single-page app: index.html |
| Sync scheduler | sync-scheduler.js |
| Automated unit tests | tests/sync-scheduler.test.cjs |
| Hosting | Vercel project yarper |
| Data/API | Supabase project Yarper |
| Backend function | yarper-api, Deno Edge Function |
| Database | PostgreSQL |

## Repository boundary

The GitHub repository contains the static frontend, scheduler, one scheduler unit-test file, app manifest, SVG icon and documentation. The production Supabase Edge Function implementation and database migration source are maintained separately and are not checked into this repository. A buyer's technical review is incomplete until the seller provides the backend source, migration history and a safe staging environment.

The frontend currently concentrates its HTML, CSS and application JavaScript in index.html. This is deployable as a static site, but its monolithic structure and limited automated test coverage increase the effort required for future maintenance.

## Database model

Previously recorded infrastructure observations identified these public application tables:

- yarper_couples: invite-code-based couple spaces.
- yarper_members: two device/member identities per couple; documented as storing a token hash, not the raw device token.
- yarper_state: XP, rounds, streak, turn state and daily quest state.
- yarper_game_sessions: prompt rounds and answers.
- yarper_reactions: emoji reactions linked to a round.

Private schema:
- private.yarper_rate_limits: request-rate-limit buckets.

These are prior audit notes and must be rechecked against the current production schema before transfer.

## Backend actions and security design

The prior handover notes describe create/join, member session lookup, heartbeat/snapshot, rename, start/advance/answer game, reactions, daily quest completion and streak claims. They also describe a custom device-token header and service-role database operations.

The Edge Function's JWT verification setting was previously reported disabled because the application uses custom device-token authentication. This is not, by itself, proof of either safety or vulnerability. Review the actual Edge Function code and test the token validation, expiry, revocation, authorization, rate limits, input validation and cross-room isolation before making security claims. The service-role key must remain only in server-side secrets.

## Frontend observations

- The browser sends requests to a Supabase Edge Function endpoint.
- A per-device session token is stored in localStorage and sent in a custom request header.
- Dynamic user-controlled strings inspected in the current frontend rendering paths are escaped before insertion into HTML.
- The frontend uses a single inline application script and inline style block. Review the deployed response headers and establish a compatible Content Security Policy; do not apply a restrictive policy without testing the inline assets.
- localStorage is accessible to scripts running on the origin. A complete XSS and token-handling review is still required.

## Previously recorded access and security observations

An earlier infrastructure review recorded RLS enabled on five public application tables, no direct anon/authenticated table grants in the inspected grant listing, and application RPC execution limited to service_role. It also recorded informational RLS-without-policy and unused-index advisor findings. These are dated observations, not a substitute for a fresh production configuration review.

No formal penetration test, privacy compliance audit or third-party dependency/licence audit has been completed.

## Deployment and credentials

Earlier deployment notes recorded a Vercel project connected to the GitHub repository and a Supabase project with an active Edge Function. Recheck current deployment status and ownership before transfer.

Before transfer:
1. Confirm buyer-controlled Vercel and Supabase organizations/accounts.
2. Confirm domain ownership and provider transfer rules.
3. Transfer project/repository ownership using supported provider workflows where possible.
4. Rotate all secrets and integration tokens; never transfer the seller's personal login.
5. Verify the buyer can deploy the frontend and backend from their own accounts.
6. Verify production create/join/game/reward flows on a buyer-controlled test couple.
7. Confirm the buyer can restore the database from a documented backup and understands the migration procedure.

## Data handling

Previous infrastructure notes recorded sample row counts in application tables, but those counts do not establish real users or active usage. The contents and ownership of the records must be classified as test/demo or real user data. Do not publish raw database exports in the sales listing. Before transfer, document lawful retention, deletion, consent and transfer arrangements.

## Frontend synchronization

The scheduler is configured for:
- 5-second sync while visible and online.
- 15-second retry while visible and offline.
- No background polling while the tab is hidden.
- Scheduler refresh on visibility, focus, page-show and network-status events.

Run the checked-in unit tests with npm test. They cover only the scheduler timing behavior and are not a full functional or security suite.
