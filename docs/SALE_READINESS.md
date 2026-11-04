# Yarper — Sale Readiness Checklist

Audit date: 4 November 2026. Production deployment, Supabase migration/function state, live schema/ACLs, advisors, source repository, test suite and Vercel deployment status were checked.

## Verified and completed

- [x] GitHub repository identified: chloestyles70-afk/yarper; private.
- [x] Proprietary software notice exists in LICENSE.md.
- [x] Static frontend, scheduler, manifest and SVG icon inspected.
- [x] Supabase project ACTIVE_HEALTHY; database region eu-west-1.
- [x] Five public application tables and one private rate-limit table inspected.
- [x] RLS enabled on all five public tables; no direct anon/authenticated table grants observed.
- [x] SECURITY DEFINER functions inspected; fixed search_path and service-role-only execute grants confirmed for join, cleanup and rate-limit functions.
- [x] Session expiry and revocation deployed; user-confirmed two-device gameplay and recovery tests remain recorded as owner-confirmed.
- [x] Insecure room-code + display-name-only recovery replaced with previous-device-token proof-of-possession.
- [x] Production migration 20261104155915 applied and repository filename aligned to the exact live migration version.
- [x] Supabase Edge Function yarper-api version 21 ACTIVE.
- [x] pg_cron 1.6.4 installed; daily rate-limit cleanup job active at 03:15.
- [x] SQL smoke tests passed for missing/wrong recovery proof rejection, valid recovery and token rotation, normal second-player join, whole-room deletion cascades, and stale rate-limit bucket cleanup.
- [x] Authenticated whole-room deletion control deployed in Settings with explicit code confirmation and warning that both players lose access.
- [x] Sensitive-information warning added beside free-text answers.
- [x] Vercel security-header configuration deployed with CSP, HSTS, frame protection, MIME-sniffing protection, referrer policy and Permissions Policy.
- [x] Supabase JS SDK pinned to 2.118.0 (MIT).
- [x] Privacy notice and Terms drafts prepared; not published because operator/jurisdiction details remain unresolved.
- [x] Security assessment and user-data audit documented.
- [x] Node 22 isolated sandbox test suite: 12 passed, 0 failed. This is not an independent penetration test.
- [x] Latest Vercel production deployment READY; aliases include yarper.vercel.app.
- [x] Vercel runtime-error query for the selected recent window returned no runtime errors.

## Findings and remaining risks

- [ ] **localStorage bearer credentials:** Active and recovery tokens remain in browser localStorage. Consider an HttpOnly, Secure, SameSite session design and perform browser XSS testing.
- [ ] **Production response-header verification:** Vercel configuration is deployed; verify actual production HTTP response headers directly.
- [ ] **Independent security assessment:** Cross-room authorization, token replay, invite-code abuse and XSS require controlled browser-based tests and independent penetration testing.
- [ ] **Dependency inventory:** SDK version is pinned, but a full resolved transitive dependency graph / SBOM is not yet recorded.
- [ ] **Historical migration reconciliation:** Fourteen live migration records were observed. The repository now contains the secure-recovery migration under its exact applied version; continue reconciling all historical migrations and verify a clean-room rebuild.
- [ ] **Frontend structure:** Most UI and application logic remains concentrated in one static index.html file.
- [ ] **Automated test scope:** 12 Node tests pass, but they do not cover all multiplayer, rewards, security and browser flows.
- [ ] **Third-party asset rights:** Rights-holder must confirm authorship, assignments and commercial transfer rights for code, prompts, icon, fonts and other media.
- [ ] **Privacy notice and terms:** Drafts exist but must not be published until operator identity/contact, launch countries, minimum age, provider processing, retention and governing law are completed and legally reviewed.
- [ ] **Abandoned-room retention:** No automatic retention period for old room content is implemented.
- [ ] **Provider privacy review:** Confirm Supabase/Vercel processing terms, subprocessors, regions, provider logs and backup retention.
- [ ] **Ownership declaration / IP evidence:** User reports no other contributors; independent contributor history and original asset provenance remain to be evidenced.
- [ ] **Hosting and domain transfer:** Verify buyer-controlled Vercel/Supabase transfer and billing arrangements.
- [ ] **Backup/restore and buyer clean-room deployment:** Not yet independently tested.

## Required before publishing the Flippa listing

- [ ] Complete rights-holder declaration and third-party asset register; verify contributor/history evidence.
- [ ] Reconcile/export the complete migration history and demonstrate a clean-room database setup.
- [ ] Verify a clean Edge Function deploy from repository source.
- [ ] Run and retain dated two-device functional test evidence on the latest production build.
- [ ] Complete independent security testing, especially custom token authentication, recovery abuse and cross-room access.
- [ ] Verify production response headers and browser XSS behavior.
- [ ] Publish reviewed privacy notice and Terms with accurate operator/contact details.
- [ ] Set and disclose abandoned-room retention; review provider backup/log deletion limits.
- [ ] Review provider data processing, hosting regions and subprocessors.
- [ ] Identify and lawfully remove, anonymize or transfer existing personal data.
- [ ] Verify production hosting, domain and billing transfer procedures.
- [ ] Prepare buyer-controlled staging deployment, backup/restore and acceptance test.
- [ ] Document operating costs, subscriptions, renewals and post-sale support scope.
- [ ] Prepare signed asset schedule and acquisition agreement.

## Commercial facts

Yarper is pre-revenue. No verified revenue, paying-customer count, active-user analytics, retention cohort or independent valuation has been supplied. Asking prices are seller-set negotiation positions, not appraisals. Do not describe the product as revenue-generating, bug-free, independently security-certified or proven to retain users without evidence.

## Scope limitation

This is a technical readiness review, not a legal opinion, formal penetration test, privacy compliance audit or independent valuation. Production user record contents were not reviewed. Third-party ownership and contributor IP assignments remain subject to owner verification.
