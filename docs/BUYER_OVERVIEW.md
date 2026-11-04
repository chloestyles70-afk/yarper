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
- Supabase-backed API and PostgreSQL data layer.
- Vercel deployment connected to the source repository.

## Current technical snapshot

- GitHub repository: chloestyles70-afk/yarper (private).
- Frontend: static HTML, CSS and browser JavaScript in index.html.
- Sync scheduler: sync-scheduler.js, with one checked-in Node.js unit-test file.
- Backend: Supabase Edge Function named yarper-api. Its implementation source is not included in this Git repository.
- Hosting: Vercel.
- A previous infrastructure review dated 4 November 2026 recorded the production deployment as READY, Supabase project as ACTIVE_HEALTHY and the Edge Function at version 18. These observations must be rechecked before a transaction.
- User-confirmed runtime checks from the owner include simultaneous game-answer handling, duplicate daily/streak reward prevention, join protection, XP duplicate prevention, duplicate game-session prevention and API error handling. These are not an independent penetration test or formal certification.

## Commercial status

Yarper is pre-revenue. No verified revenue, paying-customer count, retention cohort, customer acquisition cost, active-user analytics or independent valuation has been supplied. The seller's asking price is a negotiation position, not an appraisal or evidence of market value.

## Code and originality status

The checked-in frontend appears to be a custom static web application, but repository inspection alone cannot prove that all code, prompts, icons or other materials are original or properly assigned. The backend source is maintained separately and has not been included in this repository review. The third-party asset register and rights-holder declaration must be completed before making an originality or clean-IP representation.

## Sale scope to agree in writing

An acquisition agreement should enumerate the assets actually being transferred, including source code and repository ownership, product branding and original assets, applicable domain(s), Vercel project, Supabase project and database, deployment configuration, documentation, and any transferable third-party rights. Platform terms may restrict account or subscription transfers; verify each provider's current process before promising transfer.

The buyer should receive a clean handover, not the seller's personal passwords. Use provider-supported ownership/team transfer or rotate credentials and issue buyer-controlled credentials after closing. Do not share service-role keys in this repository or in the listing.

## Outstanding diligence

- Complete the backend source and database migration review.
- Verify ownership and transferability of all artwork, fonts, icons, prompts and any other non-original assets.
- Confirm provider account/domain transfer requirements and ongoing hosting costs.
- Classify existing database rows as demo, test or real user data; obtain consent or delete/anonymize data as legally appropriate before transfer.
- Review privacy notice, terms of use, data retention and deletion procedures.
- Complete independent security and functional testing on a buyer-controlled staging copy.
- Confirm production domain and Vercel access configuration for public buyer demonstrations.
- Agree a bounded post-sale support period, response times, exclusions and handover deliverables in writing.
