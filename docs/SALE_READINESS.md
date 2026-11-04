# Yarper — Sale Readiness Checklist

Audit date: 4 November 2026. This review includes the private GitHub repository, deployed Supabase Edge Function source, live database metadata, current database function definitions/grants, and Supabase security/performance advisors.

## Verified

- [x] GitHub repository identified: chloestyles70-afk/yarper; private.
- [x] Proprietary software notice exists in LICENSE.md.
- [x] Static frontend, scheduler, manifest and SVG icon inspected.
- [x] Deployed Edge Function yarper-api retrieved; current production version 20 ACTIVE as separately verified.
- [x] Supabase project status and database schema metadata inspected.
- [x] Five public application tables and one private rate-limit table inspected.
- [x] RLS enabled on all five public tables.
- [x] Table grant query showed service_role access and no direct anon/authenticated table grants for the Yarper tables.
- [x] SECURITY DEFINER function definitions inspected; explicit search_path settings were present.
- [x] Function ACL check confirmed anon and authenticated cannot execute consume_yarper_rate_limit, while service_role can.
- [x] Live migration history inspected; current migration inventory recorded separately.
- [x] Supabase security and performance advisors inspected.
- [x] Production rate-limit mismatch corrected and smoke-tested.
- [x] Session expiry and revocation deployed; CI tests passed and two-device/session recovery were user-confirmed.
- [x] Technical handover, buyer overview, test plan/results and third-party asset register maintained.
- [x] **Privacy and data-flow audit completed:** inspected app source, API, live schema metadata, session fields, answer/reaction storage, IP-derived rate-limit keys, and available deletion/retention behavior. See docs/PRIVACY_AND_TERMS_AUDIT.md.
- [x] Owner reports no other contributors to Yarper; historical repository contributor verification and evidence remain outstanding.

## Production correction applied

The Edge Function already rate-limited the advance_game action, but the SQL allow-list in public.consume_yarper_rate_limit omitted that action. This caused the rate-limit RPC to reject the next-turn action.

A corrective migration named allow_advance_game_rate_limit was applied to the live Supabase project on 4 November 2026. A database smoke test confirmed the action is accepted. The temporary test bucket was deleted. A follow-up privilege check confirmed anon=false, authenticated=false and service_role=true for function execution.

## Current Supabase advisor findings

- Five INFO-level rls_enabled_no_policy findings: RLS is enabled on the five public tables but no client policies exist. This is consistent with the current server-mediated model only while public table grants remain absent and the Edge Function correctly authorizes every action. Do not add broad public policies merely to silence these notices.
- Four INFO-level unused_index findings: these are not proof that indexes should be dropped. No indexes were removed.

## Findings and remaining risks

- [x] **Basic device-token lifecycle implemented:** Tokens expire after 30 days of inactivity; successful me/heartbeat calls extend the expiry. The Settings reset action revokes the server-side token before clearing localStorage. Recovery reclaims an expired/revoked slot using the same couple code and exact display name, replacing the old token hash. Independent abuse testing of token replay, recovery and cross-room isolation remains outstanding.
- [ ] **localStorage token storage:** The browser stores the device token in localStorage. Review XSS exposure and consider a stronger session design before broader commercial operation.
- [ ] **Dependency pinning:** The Edge Function imports @supabase/supabase-js using the broad @2 version range. Pin a tested exact version and preserve reproducible dependency metadata before listing.
- [ ] **Historical migrations:** Export and reconcile the complete historical migration set with the repository.
- [ ] **Frontend structure:** Most UI and application logic is concentrated in one static index.html file. It is deployable but harder to maintain and comprehensively test.
- [ ] **Automated test coverage:** The checked-in unit suite covers selected helper behavior; core multiplayer, reward and security behavior needs broader repeatable tests.
- [ ] **Content Security Policy:** Check deployed response headers and add a compatible policy after testing inline scripts/styles.
- [ ] **Third-party asset rights:** The register is a checklist; the rights-holder must confirm authorship, assignments and commercial transfer rights for code, prompts, icon, fonts and other media.
- [x] **Privacy/data-flow technical audit:** Completed. The app stores display names, room codes, device/session metadata, presence timestamps, prompts/answers, reactions, gameplay state and hashed IP-derived rate-limit identifiers. No email, phone, GPS or date-of-birth field was identified in the inspected app schema/source. See docs/PRIVACY_AND_TERMS_AUDIT.md.
- [ ] **Privacy notice and terms:** No completed user-facing privacy policy, terms, cookie notice or privacy contact was identified in the repository.
- [ ] **Data deletion and retention:** No user-facing room/data deletion or export flow was identified. Define retention for abandoned rooms, game answers and rate-limit buckets; test deletion and backup/provider-log limitations.
- [ ] **Provider privacy review:** Confirm Supabase/Vercel processing terms, regions, subprocessors, provider logs and backup retention.
- [ ] **Owner legal decisions:** Confirm operating entity/contact, launch countries, minimum age, and legal review for target jurisdictions.
- [ ] **No independent penetration test or full independent production certification is evidenced.**

## Required before publishing the Flippa listing

- [ ] Complete the rights-holder declaration and third-party asset register; verify contributor/history evidence.
- [ ] Export and reconcile all historical database migrations with the live schema.
- [ ] Pin Edge Function dependencies and verify a clean deploy from the repository.
- [ ] Run and retain dated evidence for the full two-device functional test plan.
- [ ] Conduct independent security testing, especially custom token authentication, recovery abuse and cross-room access.
- [ ] Publish reviewed privacy notice and terms with accurate operator/contact details.
- [ ] Implement and test data deletion, retention and rate-limit cleanup procedures.
- [ ] Review provider data processing, hosting regions, logs and backup retention.
- [ ] Identify and lawfully remove, anonymize or transfer existing personal data.
- [ ] Verify production hosting, domain, database and billing transfer procedures.
- [ ] Prepare buyer-controlled staging deployment and acceptance test.
- [ ] Document operating costs, subscriptions, renewals and post-sale support scope.
- [ ] Prepare signed asset schedule and acquisition agreement.

## Commercial facts

Yarper is pre-revenue. No verified revenue, paying-customer count, active-user analytics, retention cohort or independent valuation has been supplied. Asking prices are seller-set negotiation positions, not appraisals. Do not describe the product as revenue-generating, bug-free, independently security-certified or proven to retain users without evidence.

## Scope limitation

This is a technical readiness review, not a legal opinion, formal penetration test, privacy compliance audit or independent valuation. Live project metadata and configuration were inspected, but production user record contents were not reviewed. Third-party ownership and contributor IP assignments remain subject to owner verification.
