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
- Backend: Supabase Edge Function yarper-api (Deno runtime).
- Database: Supabase Postgres.
- Client session: a random per-device token is stored locally; the backend is documented as storing only its SHA-256 hash.
- Backend access: browser requests go through the Edge Function; direct public table access is intended to be restricted.

The backend implementation and database migrations are maintained in the Supabase project and are not included in this Git repository. A complete buyer code review therefore requires access to those separate assets.

## Local development

The frontend is static and does not require a frontend package installation. Serve the repository root with any static HTTP server, then open the local address in a browser. The production backend endpoint is configured in index.html; use a separate staging backend for safe development and testing.

Requirements: Node.js 20 or later for the test command.

Run the unit tests:

```sh
npm test
```

The GitHub Actions workflow runs the same tests on pushes to the sale-readiness branch and on pull requests to main. This is a narrow unit-test suite, not a full application regression or security test.

## Security and operations

- Do not commit Supabase service-role keys, Vercel tokens, database passwords or other secrets.
- The browser sends a device-token header to the Edge Function; verify token validation, expiry, revocation and authorization in the backend source.
- Do not treat a public Supabase project URL as a secret; keep privileged keys server-side.
- Review SECURITY.md, docs/TECHNICAL_HANDOVER.md, docs/TEST_PLAN.md, docs/THIRD_PARTY_ASSET_REGISTER.md and docs/SALE_READINESS.md before any ownership transfer.

## Ownership and licensing

Yarper is presented as proprietary software. See LICENSE.md. The notice does not prove ownership or assignment of every component. Third-party services and components remain subject to their own terms. A buyer must receive a separate signed transfer or licence agreement; a repository copy alone does not transfer platform accounts, domains, user data or third-party rights.
