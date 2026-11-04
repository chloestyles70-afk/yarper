# Yarper — Sale Readiness Checklist

Audit date: 4 November 2026. This review includes the private GitHub repository, deployed Supabase Edge Function source, live database metadata, current database function definitions/grants, and Supabase security/performance advisors.

## Verified

- [x] GitHub repository identified: chloestyles70-afk/yarper; private.
- [x] Proprietary software notice exists in LICENSE.md.
- [x] Static frontend, scheduler, manifest and SVG icon inspected.
- [x] Deployed Edge Function yarper-api retrieved; ACTIVE at version 18 during inspection.
- [x] Edge Function source copied into the sale-readiness branch at supabase/functions/yarper-api/index.ts.
- [x] Supabase function configuration recorded in supabase/config.toml, including verify_jwt = false.
- [x] Live project status observed ACTIVE_HEALTHY.
- [x] Five public application tables and one private rate-limit table inspected.
- [x] RLS enabled on all five public tables.
- [x] Table grant query showed service_role access and no direct anon/authenticated table grants for the Yarper tables.
- [x] SECURITY DEFINER function definitions inspected; explicit search_path settings were present.
- [x] Function ACL check confirmed anon and authenticated cannot execute consume_yarper_rate_limit, while service_role can.
- [x] Eleven existing migrations were identified; the corrective migration below brings the live migration count to twelve.
- [x] Supabase security and performance advisors inspected.
- [x] Corrected a production mismatch that caused advance_game rate-limit checks to be rejected; see below.
- [x] Corrective migration copied into the sale-readiness branch.
- [x] Added npm test command, GitHub Actions workflow, security policy, test plan, third-party asset register and updated buyer/technical documentation.

## Production correction applied

The Edge Function already rate-limited the advance_game action, but the SQL allow-list in public.consume_yarper_rate_limit omitted that action. This caused the rate-limit RPC to reject the next-turn action.

A corrective migration named allow_advance_game_rate_limit was applied to the live Supabase project on 4 November 2026. A database smoke test confirmed the action is accepted. The temporary test bucket was deleted. A follow-up privilege check confirmed anon=false, authenticated=false and service_role=true for function execution.

The Edge Function itself remained at version 18; the correction was a database function change.

## Current Supabase advisor findings

- Five INFO-level rls_enabled_no_policy findings: RLS is enabled on the five public tables but no client policies exist. This is consistent with the current server-mediated model only while public table grants remain absent and the Edge Function correctly authorizes every action. Do not add broad public policies merely to silence these notices.
- Four INFO-level unused_index findings: these are not proof that indexes should be dropped. No indexes were removed.

## Findings and remaining risks

- [ ] **Custom token lifecycle:** Supabase JWT verification is disabled for this Edge Function. The application validates a random device token via its SHA-256 hash, but the inspected code does not show token expiry or a server-side revoke/logout action. Clearing localStorage does not invalidate the stored server-side token hash. Add a revocation/rotation lifecycle or clearly document the residual risk, then independently test expiry, revocation, authorization and cross-room isolation.
- [ ] **localStorage token storage:** The browser stores the device token in localStorage. Review XSS exposure and consider a stronger session design before broader commercial operation.
- [ ] **Dependency pinning:** The Edge Function imports @supabase/supabase-js using the broad @2 version range. Pin a tested exact version and preserve reproducible dependency metadata before listing.
- [ ] **Historical migrations:** The live database has twelve migration records, but only the latest corrective migration is currently included in this repository. Export and reconcile the complete historical migration set.
- [ ] **Frontend structure:** Most UI and application logic is concentrated in one static index.html file. It is deployable but harder to maintain and comprehensively test.
- [ ] **Automated test coverage:** The checked-in unit suite covers only scheduler timing. Core multiplayer, reward and security behavior needs broader repeatable tests.
- [ ] **Content Security Policy:** No CSP was visible in repository files. Check deployed response headers and add a compatible policy after testing inline scripts/styles.
- [ ] **Third-party asset rights:** The register is a checklist; the rights-holder must confirm authorship, assignments and commercial transfer rights for code, prompts, icon, fonts and other media.
- [ ] **Privacy and user data:** No completed privacy notice, terms, retention/deletion review or data classification is evidenced here.
- [ ] **No independent penetration test or full functional regression is evidenced.**

## Required before publishing the Flippa listing

- [ ] Complete the rights-holder declaration and third-party asset register.
- [ ] Export and reconcile all historical database migrations with the live schema.
- [ ] Pin Edge Function dependencies and verify a clean deploy from the repository.
- [ ] Run the full two-device functional test plan and retain dated pass/fail evidence.
- [ ] Conduct independent security testing, especially custom token authentication and cross-room access.
- [ ] Add/review privacy policy, terms, data retention and deletion process.
- [ ] Identify and lawfully remove, anonymize or transfer existing personal data.
- [ ] Verify production hosting, domain, database and billing transfer procedures.
- [ ] Prepare buyer-controlled staging deployment and acceptance test.
- [ ] Document operating costs, subscriptions, renewals and post-sale support scope.
- [ ] Prepare signed asset schedule and acquisition agreement.

## Commercial facts

Yarper is pre-revenue. No verified revenue, paying-customer count, active-user analytics, retention cohort or independent valuation has been supplied. Asking prices are seller-set negotiation positions, not appraisals. Do not describe the product as revenue-generating, bug-free, independently security-certified or proven to retain users without evidence.

## Scope limitation

This is a technical readiness review, not a legal opinion, formal penetration test, privacy compliance audit or independent valuation. Live project metadata and configuration were inspected, but production user record contents were not reviewed. Third-party ownership and contributor IP assignments remain subject to owner verification.
