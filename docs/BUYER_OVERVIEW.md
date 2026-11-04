# Yarper — Buyer Overview

## Product

Yarper is a mobile-first couples engagement app designed for two people to share prompts, playful challenges, answers and progress in a private digital space. It is live at https://yarper.vercel.app/.

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

## Current technical snapshot (4 November 2026)

- GitHub repository: `chloestyles70-afk/yarper` (currently private).
- Production Vercel project: `yarper`; latest production deployment observed in READY state.
- Supabase project: `Yarper`; status observed as ACTIVE_HEALTHY.
- Active Edge Function: `yarper-api`, version 18.
- Database: five public application tables and one private rate-limit table.
- Applied migration history: 11 migrations.
- Observed database rows at audit time: 9 couples, 18 member records, 9 state records, 11 game sessions and 13 reactions. These are database records, **not verified active-user, paying-customer or revenue metrics**; the owner must classify demo/test records before a buyer relies on them.
- User-confirmed runtime checks from the owner: simultaneous game-answer handling, duplicate daily/streak reward prevention, join protection, XP duplicate prevention, duplicate game-session prevention and API error handling. These are not an independent penetration test or formal certification.

## Commercial status

No verified revenue, paying-customer count, retention cohort, customer acquisition cost or independent valuation has been supplied. The previously discussed USD 2,500 figure is an owner-proposed asking-price target, not an appraisal or evidence of market value.

## Sale scope to agree in writing

An acquisition agreement should enumerate the assets actually being transferred, including source code and repository ownership, product branding and original assets, applicable domain(s), Vercel project, Supabase project and database, deployment configuration, documentation, and any transferable third-party rights. Platform terms may restrict account or subscription transfers; verify each provider's current process before promising transfer.

The buyer should receive a clean handover, not the seller's personal passwords. Use provider-supported ownership/team transfer or rotate credentials and issue buyer-controlled credentials after closing. Do not share service-role keys in this repository or in the listing.

## Outstanding diligence

- Verify ownership and transferability of all artwork, fonts, icons and any other non-original assets.
- Confirm provider account/domain transfer requirements and ongoing hosting costs.
- Classify existing database rows as demo, test or real user data; obtain consent or delete/anonymize data as legally appropriate before transfer.
- Review privacy notice, terms of use, data retention and deletion procedures.
- Complete independent security and functional testing on buyer's staging copy.
- Confirm production domain and Vercel access configuration for public buyer demonstrations.
