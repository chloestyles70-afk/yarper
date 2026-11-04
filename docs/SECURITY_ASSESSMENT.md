# Yarper — Security Assessment (Code and Configuration Review)

**Date:** 4 November 2026  
**Scope:** Static review of frontend and Edge Function source; live Supabase schema, RLS state, grants, function ACLs, foreign-key deletion behavior, Supabase advisors, production migration/deployment status, and disposable-data SQL smoke tests.  
**Not a penetration test:** No independent external attacker simulation, broad fuzzing, formal threat-model validation, or comprehensive browser/device security test was performed.

## 1. Findings and remediation

### High — Insecure expired-session slot recovery — FIX DEPLOYED

The original join RPC allowed an expired/revoked slot to be reclaimed using only the six-character room code and matching display name. Those details were not sufficient proof of identity and could allow slot takeover.

**Remediation:** Recovery now also requires the SHA-256 hash of the previous device token. The database compares it with the old member token hash before rotating the credential. The browser preserves the previous token as a recovery credential across expiry and device reset. A user who clears all browser site data and loses that credential cannot use automated recovery.

**Production status:** Migration 20261104155915 is applied. Edge Function yarper-api version 21 is ACTIVE. Production database smoke tests confirmed that missing and incorrect recovery proof are rejected, correct proof reclaims the same member slot, the new token hash is stored, and the previous hash is no longer present. Normal second-player joining also passed.

### Medium — Browser bearer token in localStorage — OPEN RISK

The active device token and recovery credential are stored in localStorage. Any successful same-origin script injection could read them. The reviewed UI escapes user-controlled content in the main dynamic HTML render paths, and a CSP is configured, but the CSP permits inline scripts/styles because the current app uses inline handlers and styles. It therefore does not fully mitigate XSS.

**Recommendation:** Move to a server-managed HttpOnly, Secure, SameSite cookie or another architecture that keeps bearer secrets inaccessible to page JavaScript. Continue to test all user-controlled render paths and avoid third-party scripts.

### Medium — Room-code entropy and online guessing — MITIGATED, MONITOR

Generated room codes contain six characters from a 32-character alphabet (about 30 bits of entropy). Creation and join endpoints are rate-limited using an IP-derived bucket. Rate limiting reduces guessing but does not make a room code a strong password. Keep codes private and monitor abuse. Consider longer codes or a separate invitation secret if attack volume increases.

### Medium — Privacy and retention — PARTIALLY REMEDIATED

The app stores display names, room codes, session metadata, prompts and free-text answers, reactions and gameplay state. Answers may contain sensitive relationship information.

**Production changes:** Authenticated players can permanently delete the entire shared room from Settings after entering the room code. Database cascade deletion was tested with disposable data across members, state, sessions and reactions. A daily cleanup job deletes rate-limit bucket metadata older than seven days. The answer form warns users not to submit passwords, financial details or highly sensitive personal information.

**Still open:** Privacy notice and Terms are drafts, not linked or published. Operator identity/contact, minimum age, launch countries, governing law, provider subprocessors, backup retention and provider log handling need confirmation and legal review. No automatic retention period for inactive room content is implemented.

### Low — Browser security headers — CONFIGURED AND DEPLOYED; RESPONSE CHECK OPEN

Vercel configuration now defines CSP, frame protections, MIME-sniffing protection, referrer policy, HSTS, Permissions Policy and Cross-Origin-Opener-Policy. CSP permits inline scripts/styles due to the existing single-file frontend. The latest production deployment is READY. The actual production response headers still need a direct HTTP-header check.

### Low — Dependency pinning — FIXED

The Edge Function Supabase JS SDK import is pinned to stable version 2.118.0 (MIT licence). A complete resolved transitive dependency inventory / SBOM remains to be recorded.

## 2. Live database controls observed

- RLS is enabled on all five public application tables.
- No direct anon/authenticated table grants were found on the five application tables.
- The application relies on the server-side Edge Function using the service role.
- The private rate-limit table has a service-role-only policy.
- SECURITY DEFINER RPCs use fixed search paths; join, cleanup and rate-limit function execute grants are limited to service_role. Live ACL query returned anon=false, authenticated=false, service_role=true.
- Foreign keys from members, game sessions, reactions and state to the couple room use ON DELETE CASCADE. Reactions also cascade when their game session is deleted.
- Supabase security advisor reports five informational RLS-enabled-without-policy findings. This matches the server-mediated model only while direct client grants remain absent and Edge Function authorization remains correct.
- Performance advisor reports three informational unused-index findings. No indexes were dropped.

## 3. Production changes and verification

- Migration 20261104155915 is recorded in Supabase migration history and the repository filename is aligned to that exact version.
- pg_cron 1.6.4 is installed.
- Active job yarper-rate-limit-cleanup runs daily at 03:15 and calls cleanup_yarper_rate_limits().
- Disposable-data SQL smoke tests passed:
  - Missing recovery proof rejected.
  - Incorrect recovery proof rejected.
  - Correct previous device token hash accepted.
  - Existing member ID preserved; new token hash installed; revocation cleared; old hash absent.
  - Normal second-player join to a one-member room passed.
  - Whole-room deletion cascaded through members, state, game sessions and reactions.
  - Eight-day-old rate-limit bucket deleted by cleanup function.
- Supabase Edge Function yarper-api version 21 is ACTIVE with verify_jwt=false and custom device-token authentication.
- Vercel production deployment for the merged hardening change is READY and aliases include yarper.vercel.app.
- Node 22 isolated sandbox test run: 13 passed, 0 failed (before the latest extra sensitive-answer warning test; rerun required for final count).
- GitHub Actions runs for the recent branch/main commits were queued and did not return a final conclusion during this review. The isolated Node test run is the available green test evidence.
- Vercel runtime-error query for the selected recent window returned no runtime errors.

## 4. Remaining verification before a full security pass

- [ ] Re-run the complete Node test suite after the latest warning and migration-filename changes.
- [ ] Verify actual production response headers with a direct HTTP request.
- [ ] Run browser-based XSS payload checks against display names, prompts, answers and reactions.
- [ ] Run cross-room authorization, token replay and invite-code guessing tests against a controlled staging environment.
- [ ] Commission an independent penetration test before describing Yarper as independently security-tested.
- [ ] Review localStorage bearer-token exposure and plan a safer cookie/session architecture.
- [ ] Record a full dependency inventory/SBOM and verify provider-side logs/backups.

## 5. Conclusion

The original high-risk recovery weakness is fixed in production and the database smoke tests passed. Room deletion, rate-limit cleanup, dependency pinning and security-header configuration are deployed. However, localStorage token exposure, browser-level abuse tests, production response-header verification and independent penetration testing remain open. **Yarper must not yet be described as penetration-tested, fully security-certified, bug-free or privacy-law compliant.**
