# Yarper

Yarper is a private, two-person couples game and connection app. Each partner joins the same shared space using a six-character code. The app synchronizes prompts, answers, reactions, progress and daily rewards between both devices.

**Live app:** https://yarper.vercel.app/

## Product features

- Create a private couple space or join with a six-character code.
- Separate player identities and shared couple progress.
- Question, challenge, truth-or-dare, conversation-card and date-night prompt modes.
- Shared answers, emoji reactions and recent round history.
- XP, levels, level-up celebrations, daily quests and streak rewards.
- Mini tools including quick-choice prompts and a timed challenge.
- Mobile-first interface.

## Architecture

- Frontend: single-page HTML, CSS and browser JavaScript in index.html.
- Hosting: Vercel, connected to this GitHub repository.
- Backend: Supabase Edge Function yarper-api (Deno runtime), source in supabase/functions/yarper-api/index.ts.
- Database: Supabase Postgres; migration history and current schema require the live Supabase project for full verification.
- Client session: a random per-device token is stored locally; the backend stores its SHA-256 hash.
- Backend access: browser requests go through the Edge Function; direct public table access is restricted.

## Local development

The frontend is static and does not require a frontend package installation. Serve the repository root with any static HTTP server, then open the local address in a browser. Use a separate staging backend for safe development and testing.

Requirements: Node.js 20 or later for the test command.

Run the unit tests:

```sh
npm test
```

The GitHub Actions workflow runs the same tests on pushes to the sale-readiness branch and on pull requests to main. This is a narrow unit-test suite, not a full application regression or security test.

The production function uses a custom device-token authentication flow and has JWT verification disabled in Supabase configuration. Review the function source and test its token validation, expiry, revocation and authorization before deployment.

## Security and operations

- Do not commit Supabase service-role keys, Vercel tokens, database passwords or other secrets.
- The service-role key is read from the Supabase server-side environment and must never be placed in browser code.
- The browser stores its device token in localStorage; review XSS exposure and token lifecycle before a wider release.
- Review SECURITY.md, docs/TECHNICAL_HANDOVER.md, docs/TEST_PLAN.md, docs/THIRD_PARTY_ASSET_REGISTER.md and docs/SALE_READINESS.md before any ownership transfer.

## Ownership and licensing

Yarper is presented as proprietary software. See LICENSE.md. The notice does not prove ownership or assignment of every component. Third-party services and components remain subject to their own terms. A buyer must receive a separate signed transfer or licence agreement; a repository copy alone does not transfer platform accounts, domains, user data or third-party rights.
