# Yarper — Technical Handover

## Components

| Component | Current implementation |
| --- | --- |
| Web client | Static single-page app: `index.html` |
| Sync scheduler | `sync-scheduler.js` |
| Automated unit tests | `tests/sync-scheduler.test.cjs` |
| Hosting | Vercel project `yarper` |
| Data/API | Supabase project `Yarper` |
| Backend function | `yarper-api`, Deno Edge Function |
| Database | PostgreSQL 17 |

## Database model

Public application tables observed:

- `yarper_couples`: invite-code-based couple spaces.
- `yarper_members`: two device/member identities per couple; stores a token hash, not the raw device token.
- `yarper_state`: XP, rounds, streak, turn state and daily quest state.
- `yarper_game_sessions`: prompt rounds and answers.
- `yarper_reactions`: emoji reactions linked to a round.

Private schema:

- `private.yarper_rate_limits`: request-rate-limit buckets.

Key integrity controls observed include unique couple codes, unique member role per couple, unique device-token hashes, a partial unique index allowing only one waiting game session per couple, foreign keys and check constraints.

## Backend actions

The Edge Function handles create/join, member session lookup, heartbeat/snapshot, rename, start/advance/answer game, reactions, daily quest completion and streak claims. Rate limits apply to create/join and member actions. Several state-changing operations use PostgreSQL functions with row locks to prevent duplicate joins, answers and reward claims.

The Edge Function has JWT verification disabled and uses a custom device-token header instead. This is an intentional architecture choice, not proof that the endpoint is unauthenticated: verify the custom token validation path and service-role function grants during every security review. The service-role key must remain only in Supabase's server-side secrets.

## Access and security observations

- RLS is enabled on all five public application tables.
- Direct `anon` and `authenticated` table grants were not present in the inspected grants; service-role access is used by the Edge Function.
- Application RPC execution was limited to `service_role` in the inspected function privileges.
- Security advisor reported five informational `rls_enabled_no_policy` findings because RLS is enabled with no client-facing policies. This is consistent with the current server-only data-access pattern; do not add broad public policies just to silence the notices.
- Performance advisor reported four unused-index notices. Treat these as low-confidence observations on a small dataset; do not drop indexes without workload evidence.
- No formal penetration test, privacy compliance audit or third-party dependency/licence audit has been completed.

## Deployment and credentials

The Vercel project is connected to the GitHub repository and its latest production deployment was observed READY during the audit. Supabase project status was ACTIVE_HEALTHY and `yarper-api` was active at version 18.

Before transfer:
1. Confirm buyer-controlled Vercel and Supabase organizations/accounts.
2. Confirm domain ownership and provider transfer rules.
3. Transfer project/repository ownership using supported provider workflows where possible.
4. Rotate all secrets and integration tokens; never transfer the seller's personal login.
5. Verify the buyer can deploy the frontend and backend from their own accounts.
6. Verify production create/join/game/reward flows on a buyer-controlled test couple.

## Data handling

The audit observed 9 couple rows, 18 member rows, 9 state rows, 11 game-session rows and 13 reaction rows. The contents and ownership of these records were not inspected as personal data. The seller must identify demo/test records versus real user records and handle real data lawfully before closing. Do not publish raw database exports in the sales listing.

## Frontend synchronization

The production branch previously polled the backend every second, including when the tab was hidden. The sale-readiness branch changes this to:
- 5-second sync while visible and online.
- 15-second retry while visible and offline.
- No background polling while the tab is hidden.
- Immediate scheduler refresh on visibility, focus, page-show and network-status events.

Run the unit tests with `node --test tests/*.test.cjs`.
