# Yarper — Sale Readiness Checklist

Audit date: 4 November 2026. This record reflects the repository and production checks completed on this date. It is a diligence record, not a certification or legal opinion.

## Verified and completed

- [x] GitHub repository identified: `chloestyles70-afk/yarper`; private; seller has admin access.
- [x] Proprietary software notice exists in `LICENSE.md`.
- [x] Static frontend, scheduler, manifest, SVG icon and Edge Function source inspected.
- [x] Supabase project reported ACTIVE_HEALTHY; database region eu-west-1.
- [x] Five public application tables and one private rate-limit table inspected.
- [x] RLS enabled on all five public tables; no direct anon/authenticated table grants observed.
- [x] Reviewed SECURITY DEFINER functions use fixed search_path and service-role-only execute grants for join, cleanup and rate-limit functions.
- [x] Session expiry/revocation deployed; selected two-device gameplay and recovery tests are owner-confirmed, not independently witnessed.
- [x] Recovery requires proof of possession of the previous device token; room code and display name alone are insufficient.
- [x] All 16 applied migration files are present in the repository and their SQL was compared with live Supabase migration statements; contents match.
- [x] Supabase Edge Function `yarper-api` version 23 reported ACTIVE.
- [x] pg_cron 1.6.4 installed; daily rate-limit cleanup job active at 03:15.
- [x] SQL smoke tests passed for recovery proof rejection/acceptance and token rotation, second-player join, room deletion cascades and stale rate-limit cleanup.
- [x] Authenticated sync and snapshot actions rate-limited to 90 requests per member per five-minute window; SQL smoke test confirmed enforcement.
- [x] Authenticated whole-room deletion deployed in Settings with explicit code confirmation and warning that both players lose access.
- [x] Vercel security-header configuration deployed; actual production response-header verification remains open.
- [x] Supabase JS SDK pinned to 2.118.0 (MIT).
- [x] Privacy notice and Terms drafts prepared; not published because operator/jurisdiction details remain unresolved.
- [x] Hardened backup script and restore runbook committed; shell syntax and mocked export/encryption/checksum flow passed. No production database was accessed by the mock test.
- [x] Buyer-controlled handover checklist and direct dependency inventory documented.
- [x] Node regression suite: 28 passed, 0 failed on the latest recorded main build. This is not a full browser, end-to-end or security test.
- [x] Latest recorded Vercel production deployment READY; alias includes yarper.vercel.app.
- [x] Vercel runtime-error query for the selected recent window returned no runtime errors.

## Open diligence items

- [ ] **Production backup and restore:** No production backup, off-site copy or buyer-controlled restore drill has been completed.
- [ ] **Independent security assessment:** No independent penetration test. Browser tests should cover token replay, XSS, cross-room authorization, invite-code abuse, recovery abuse and session lifecycle.
- [ ] **Browser/device acceptance:** Complete and retain dated two-physical-device acceptance evidence on the current production build.
- [ ] **Production response headers:** Verify actual live HTTP response headers rather than relying only on deployed configuration.
- [ ] **Dependency/SBOM:** Direct dependencies are inventoried; a complete resolved transitive SBOM and license review remain outstanding.
- [ ] **Clean-room rebuild:** A clean-room database rebuild and clean Edge Function deployment from repository source have not been demonstrated.
- [ ] **Frontend maintainability:** Most UI and application logic remains concentrated in one static `index.html`.
- [ ] **Test scope:** 28 Node tests do not cover all multiplayer, reward, security and browser flows.
- [ ] **IP and asset rights:** Rights-holder must confirm authorship, contributor assignments and commercial transfer rights for code, icon, prompts, fonts and other assets. Repository history is not conclusive proof of ownership.
- [ ] **Legal/privacy:** Privacy notice and Terms remain drafts. Operator identity/contact, launch countries, minimum age, provider processing, retention and governing law need completion and qualified review.
- [ ] **Data retention:** No automatic retention period for abandoned-room content is implemented.
- [ ] **Provider privacy:** Confirm Vercel/Supabase processing terms, subprocessors, regions, logs and backup retention.
- [ ] **Existing user data:** Classify records as test/demo or real user data and document lawful deletion, anonymization or transfer.
- [ ] **Transferability:** Verify buyer-controlled GitHub, Vercel, Supabase and domain transfer arrangements.
- [ ] **Operating costs:** Document plans, subscriptions, renewals and expected post-sale operating costs.
- [ ] **Transaction documents:** Complete an asset schedule and signed acquisition agreement before transfer.

## Commercial facts

- Seller's current asking price: **USD 3,000** for an outright acquisition, subject to a written agreement and diligence.
- This is a seller-set asking price, not an independent valuation, appraisal or guarantee of market value.
- Yarper is pre-revenue. No verified revenue, paying-customer count, active-user analytics, retention cohort or customer acquisition cost has been supplied.
- Database row counts are not proof of active users, customers or traction. Existing records must be classified before any traction claim is made.
- No ownership, source-code access transfer, provider credential handover or control transfer is to occur until the acquisition agreement is signed and payment has cleared.

## Scope limitation

This is a technical readiness record based on specified repository and production observations. It is not a legal opinion, formal penetration test, privacy compliance audit, independent valuation or proof of ownership. Production user record contents were not reviewed. Third-party ownership and contributor IP assignments remain subject to rights-holder verification.
