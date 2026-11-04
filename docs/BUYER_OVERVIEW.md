# Yarper — Buyer Overview

**Transaction:** Outright acquisition
**Seller asking price:** USD 3,000
**Live product:** https://yarper.vercel.app/

Yarper is a mobile-first, two-person couples game and connection web app. One partner creates a private space and the other joins with a six-character code. The pair can play prompt-led activities, submit answers and reactions, and build shared progress.

## Product capabilities
- Private two-person spaces and partner join flow.
- Question, challenge, truth-or-dare, conversation-card and date-night prompts.
- Synchronized answers, reactions and recent round history.
- XP, levels, daily quests and streak rewards.
- Quick-choice prompts and a timed challenge.
- Responsive, mobile-first web interface.

## Technology snapshot
- Frontend: static single-page HTML, CSS and browser JavaScript.
- Hosting: Vercel.
- Backend: Supabase Edge Function (`yarper-api`, version 23 reported ACTIVE on 4 November 2026).
- Database: Supabase PostgreSQL 17.
- Schema history: 16 applied migration files are present in the repository and SQL was reconciled against live migration statements.
- Automated checks: 28 Node regression tests reported passing on the latest recorded main build.

## Security and operations — evidence and limits
Implemented controls include server-mediated database access, RLS on the five public application tables, hashed device-token storage, session expiry/revocation, proof-of-possession recovery, request rate limits, selected atomic database operations and configured web security headers.

These controls are not an independent security certification. No independent penetration test, complete two-physical-device acceptance report, production backup/restore drill or clean-room rebuild has been completed. Active and recovery tokens are stored in browser localStorage and remain a known XSS exposure.

## Commercial position
Yarper is pre-revenue. No verified revenue, paying-customer count, retention cohort, customer acquisition cost or independently measured active-user analytics has been supplied. Raw database row counts must not be presented as traction. USD 3,000 is the seller's asking price only, not an appraisal or guarantee of value.

## Proposed transaction
The seller is seeking an outright acquisition. The exact assets and exclusions must be listed in a signed agreement. The buyer should complete technical, security, privacy, IP and commercial diligence and arrange buyer-controlled accounts.

**No ownership, source-code control, provider credential or account handover will occur until the written acquisition agreement is signed and payment has cleared.** Credentials will not be sent by ordinary email. Provider-supported transfer or buyer-account migration and secret rotation will be used at closing.

## Open diligence items
1. Production backup, off-site storage and buyer-controlled restore test.
2. Independent security review and dated two-device browser acceptance.
3. Production response-header verification and XSS testing.
4. Complete transitive SBOM and licence review.
5. Rights-holder declaration, contributor/IP assignments and asset-rights evidence.
6. Privacy/Terms completion and legal review for intended jurisdictions.
7. Data classification, retention and lawful transfer/deletion plan.
8. Clean-room database rebuild and buyer-controlled deployment.
9. Provider/domain transfer plan and operating-cost schedule.

See `docs/SALE_READINESS.md`, `docs/TECHNICAL_HANDOVER.md`, `docs/DEPENDENCY_INVENTORY.md`, `docs/THIRD_PARTY_ASSET_REGISTER.md` and `docs/BUYER_HANDOVER_CHECKLIST.md` for detailed diligence records.

*Private and confidential. Prepared 4 November 2026. Informational only; not an offer, warranty, legal opinion or independent valuation.*
