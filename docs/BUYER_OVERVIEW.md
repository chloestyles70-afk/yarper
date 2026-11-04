# Yarper — Buyer Overview

## Product

Yarper is a mobile-first couples engagement app designed for two people to share prompts, playful challenges, answers and progress in a private digital space. Live demo: https://yarper.vercel.app/

## What is included

- Private two-person spaces created with a six-character invite code.
- Player 1 / Player 2 identity and shared couple state.
- Five prompt categories: questions, challenges, truth-or-dare, cards and date-night ideas.
- Synchronized rounds, partner answers and emoji reactions.
- XP, levels, daily quest and streak reward mechanics.
- Mini-game utilities and a timed challenge.
- Responsive single-page web interface.
- Supabase Edge Function source and PostgreSQL-backed data layer.
- Vercel deployment connected to the source repository.
- 30-day idle session expiry, server-side revocation and proof-of-possession recovery.
- Authenticated whole-room deletion from Settings, with a warning that both members' shared data and access are removed.
- Daily cleanup of rate-limit bucket metadata older than seven days.

## Current technical snapshot — 4 November 2026

- GitHub repository: chloestyles70-afk/yarper (private).
- Frontend: static HTML, CSS and browser JavaScript in index.html.
- Backend: Supabase Edge Function yarper-api, version 21 ACTIVE; source is in supabase/functions/yarper-api/index.ts.
- Supabase project: Yarper, status ACTIVE_HEALTHY; PostgreSQL 17; database region eu-west-1.
- Database: five public application tables and one private rate-limit table; 14 live migration records.
- RLS is enabled on all five public application tables. The inspected table grants showed no direct anon/authenticated table grants.
- Reviewed SECURITY DEFINER RPCs use fixed search paths and are executable by service_role, not anon/authenticated.
- Device tokens expire after 30 days of inactivity; successful heartbeats extend expiry. Recovery of an expired/revoked slot now requires proof of possession of the previous device token, not just a room code and display name.
- Daily pg_cron job yarper-rate-limit-cleanup is active at 03:15.
- Vercel production deployment is READY and aliases include yarper.vercel.app.
- Node 22 isolated sandbox tests: 12 passed, 0 failed at the time of the recorded run. The suite does not constitute comprehensive browser or security testing.
- The owner previously confirmed two-device gameplay and session recovery tests. Those checks are user-confirmed, not independently witnessed by the reviewer.

## Privacy and security status

A technical data inventory and security review are documented. A user can delete the entire couple room, which cascades to both members' records, answers, reactions and progress. Rate-limit metadata is cleaned after seven days.

Privacy Notice and Terms drafts exist in docs/ but are not published or linked in the app. They require the operator's legal identity/contact, launch jurisdictions, minimum age, abandoned-room retention policy, provider-processing details and legal review. Device/recovery tokens remain in browser localStorage, and independent penetration testing is not complete.

## Commercial status

Yarper is pre-revenue. No verified revenue, paying-customer count, retention cohort, customer acquisition cost or active-user analytics has been supplied. The seller's asking price is a negotiation position, not an appraisal or evidence of market value.

## Code and originality status

The checked-in frontend and backend source are available for review. Repository inspection alone cannot prove that all code, prompts, icons or other materials are original or properly assigned. The rights-holder declaration and third-party asset register must be completed before making a clean-IP representation.

## Sale scope to agree in writing

An acquisition agreement should enumerate the assets actually being transferred, including source code and repository ownership, product branding and original assets, applicable domain(s), Vercel project, Supabase project and database, deployment configuration, documentation, and any transferable third-party rights. Platform terms may restrict account or subscription transfers; verify each provider's current process before promising transfer.

The buyer should receive a clean handover, not the seller's personal passwords. Use provider-supported ownership/team transfer or rotate credentials and issue buyer-controlled credentials after closing. Do not share service-role keys in the repository or in the listing.

## Outstanding diligence

- Reconcile the full migration history and demonstrate a clean-room database setup.
- Verify a clean Edge Function deploy from repository source.
- Verify actual production security headers and complete browser-based XSS/cross-room tests.
- Obtain independent penetration testing.
- Verify ownership and transferability of artwork, fonts, icons, prompts and any other non-original assets.
- Confirm provider account/domain transfer requirements and ongoing hosting costs.
- Review and publish final privacy notice and terms.
- Classify existing database rows as test/demo or real user data; arrange lawful retention, deletion or transfer.
- Complete buyer-controlled staging, backup/restore and acceptance testing.
- Agree a bounded post-sale support period, response times, exclusions and handover deliverables in writing.
