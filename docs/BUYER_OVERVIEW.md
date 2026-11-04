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

## Current technical snapshot — 4 November 2026

- GitHub repository: chloestyles70-afk/yarper (private).
- Frontend: static HTML, CSS and browser JavaScript in index.html.
- Backend: deployed Supabase Edge Function yarper-api, version 20 after the session-lifecycle update; its source is now included in supabase/functions/yarper-api/index.ts.
- Supabase project: Yarper, status ACTIVE_HEALTHY at the time of inspection.
- Database: five public application tables and one private rate-limit table; 13 migration records after the session-lifecycle update.
- RLS is enabled on all five public application tables. The inspected table grants showed access for service_role and no direct anon/authenticated table grants.
- The five public tables returned informational RLS-enabled-without-policy advisor notices. This matches the current server-mediated access pattern only if the Edge Function remains the sole data path; it does not replace a review of function authorization.
- Device tokens now have a 30-day idle expiry, successful heartbeats extend the expiry, and the Settings reset action revokes the server-side token before clearing local storage. Recovery replaces the old token hash when the user joins with the same couple code and exact display name.
- User-confirmed runtime checks from the owner include simultaneous game-answer handling, duplicate daily/streak reward prevention, join protection, XP duplicate prevention, duplicate game-session prevention and API error handling. These are not an independent penetration test or formal certification.

## Commercial status

Yarper is pre-revenue. No verified revenue, paying-customer count, retention cohort, customer acquisition cost or active-user analytics has been supplied. The seller's asking price is a negotiation position, not an appraisal or evidence of market value.

## Code and originality status

The checked-in frontend and backend source are available for review. Repository inspection alone cannot prove that all code, prompts, icons or other materials are original or properly assigned. The rights-holder declaration and third-party asset register must be completed before making a clean-IP representation.

## Sale scope to agree in writing

An acquisition agreement should enumerate the assets actually being transferred, including source code and repository ownership, product branding and original assets, applicable domain(s), Vercel project, Supabase project and database, deployment configuration, documentation, and any transferable third-party rights. Platform terms may restrict account or subscription transfers; verify each provider's current process before promising transfer.

The buyer should receive a clean handover, not the seller's personal passwords. Use provider-supported ownership/team transfer or rotate credentials and issue buyer-controlled credentials after closing. Do not share service-role keys in this repository or in the listing.

## Outstanding diligence

- Reconcile the checked-in migration with the live migration history and export the complete historical schema/migration set.
- Pin the Edge Function dependency version and preserve a lockfile or equivalent reproducible dependency record.
- Verify ownership and transferability of all artwork, fonts, icons, prompts and any other non-original assets.
- Confirm provider account/domain transfer requirements and ongoing hosting costs.
- Classify existing database rows as demo, test or real user data; obtain consent or delete/anonymize data as legally appropriate before transfer.
- Review privacy notice, terms of use, data retention and deletion procedures.
- Complete independent security and full functional testing on a buyer-controlled staging copy.
- Agree a bounded post-sale support period, response times, exclusions and handover deliverables in writing.
