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

- Frontend: single-page HTML, CSS and browser JavaScript in `index.html`.
- Hosting: Vercel, connected to this GitHub repository.
- Backend: Supabase Edge Function `yarper-api` (Deno runtime).
- Database: Supabase Postgres.
- Client session: a random per-device token is stored locally; only its SHA-256 hash is stored in the database.
- Backend access: browser requests go through the Edge Function; direct public table access is intentionally restricted.

## Local development

The frontend is static and does not require a frontend package installation. Serve the repository root with any static HTTP server, then open the local address in a browser. The live backend URL is currently configured in `index.html`.

Run the scheduler unit tests with Node.js:

```sh
node --test tests/*.test.cjs
```

The Supabase Edge Function source and production database migrations are managed in the Supabase project. Do not deploy backend changes from a local copy unless the matching migration and function changes have been reviewed.

## Security and operations

- Do not commit Supabase service-role keys, Vercel tokens, or other secrets.
- The Edge Function currently uses a device-token header and verifies the token hash against the member record.
- Public table access is restricted; RLS is enabled on the application tables.
- The Supabase project currently has five application tables and one private rate-limit table.
- Review `docs/TECHNICAL_HANDOVER.md` and `docs/SALE_READINESS.md` before any ownership transfer.

## Ownership and licensing

Yarper is proprietary software. See [LICENSE.md](LICENSE.md). Third-party services and components remain subject to their own terms. A buyer must receive a separate signed transfer or licence agreement; a repository copy alone does not transfer platform accounts, domains, or third-party rights.
