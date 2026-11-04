# Yarper — Security Assessment (Code and Configuration Review)

**Date:** 4 November 2026  
**Scope:** Static review of frontend and Edge Function source; live Supabase schema, RLS state, grants, function ACLs, foreign-key deletion behavior, and Supabase advisors. Review-branch changes are distinguished from production-effective controls.  
**Not a penetration test:** No external attacker simulation, broad fuzzing, formal threat-model validation, independent audit firm, or comprehensive browser/device security test was performed.

## 1. Findings

### High — Insecure expired-session slot recovery (identified; fix prepared)

**Original behavior:** The join RPC allowed an expired/revoked slot to be reclaimed using only the six-character room code and matching display name. Those are not sufficient proof that the person is the original member. Someone who knows or obtains both could take over the inactive slot and access the room's stored shared history.

**Fix prepared in PR #7:** Recovery now requires the SHA-256 hash of the previous device token in addition to the room code and display name. The old token hash is compared before the slot is reassigned. The browser preserves the old device token as a recovery credential when a session expires or is reset. If the user clears all site data and loses this credential, automated recovery is not possible.

**Status:** Implemented in branch; pending production migration and Edge Function deployment, then verification.

### Medium — Browser bearer token in localStorage (open risk)

The active device token and recovery credential are stored in localStorage. Any successful same-origin script injection could read them. The reviewed UI escapes user-controlled content in the main dynamic HTML render paths, and a restrictive CSP is added in the PR, but the CSP permits inline scripts/styles because the current app uses inline handlers and styles. It therefore does not fully mitigate an XSS vulnerability.

**Recommendation:** Migrate to a server-managed HttpOnly, Secure, SameSite cookie or another architecture that keeps bearer secrets inaccessible to page JavaScript. Until then, keep all dynamic HTML escaping, avoid third-party scripts, and test XSS payloads in a real browser.

### Medium — Room-code entropy and online guessing

Generated room codes contain six characters from a 32-character alphabet (about 30 bits of entropy). Creation and join endpoints are rate-limited using an IP-derived bucket. Rate limiting reduces guessing but does not make a room code a strong password. Keep codes private and monitor abuse. Consider a longer code or a separate invitation secret if attack volume increases.

### Medium — Privacy and retention

The app stores display names, room codes, session metadata, prompts and free-text answers, reactions and gameplay state. Answers may contain sensitive relationship information. The repository previously lacked user-facing privacy and terms documents and had no user-requested deletion flow.

**Fix prepared:** Draft privacy notice and terms are added for review; a user-initiated whole-room deletion endpoint/UI is added; rate-limit metadata cleanup is scheduled. The drafts are not publish-ready because operator identity, contact details, minimum age, launch countries, data-region facts and governing law have not been confirmed. No automatic retention period for inactive room content is implemented.

### Low — Content Security Policy and browser headers (fix prepared)

The original deployment had no repository-defined CSP. A Vercel header configuration is added with a self-only default, limited Supabase API connection, object/frame restrictions, HSTS, MIME-sniffing protection, referrer policy and a restrictive Permissions Policy. Inline script/style allowances remain due to the current single-file frontend design.

### Low — Dependency version not pinned (fix prepared)

The Edge Function previously imported the Supabase JS SDK through the broad @2 range. The PR pins the import to @2.118.0, a stable release with MIT licence. The final resolved transitive dependency graph and a full software bill of materials remain to be recorded.

## 2. Live database controls observed

- RLS is enabled on the five public application tables.
- No direct anon/authenticated table grants were found on the five application tables.
- The application relies on the server-side Edge Function using the service role.
- The private rate-limit table has a service-role-only policy.
- The reviewed SECURITY DEFINER RPCs had fixed search paths and execute grants limited to service_role; anon/authenticated execute privileges were false.
- Foreign keys from members, game sessions, reactions and state to the couple room use ON DELETE CASCADE. Reactions also cascade when their game session is deleted.
- Supabase security advisor returned informational RLS-without-policy findings consistent with the server-mediated architecture and no direct client table grants. This must be rechecked after migration.

## 3. Additional observations

- User-controlled display names, prompts, answers and reactions are escaped before insertion into dynamic HTML in the reviewed render paths; plain text is inserted with textContent in other areas.
- Request bodies are limited to 8 KiB and JSON is validated.
- CORS is restricted to the production Yarper origin for browser requests. CORS is not authentication; non-browser requests without an Origin header are still expected to prove possession of a device token for protected actions.
- The service-role key is read from Supabase environment variables in the Edge Function and is not embedded in the browser source inspected.
- The current API uses a custom bearer-token model with verify_jwt=false; each protected request is authenticated against a SHA-256 token hash and session expiry/revocation.
- A six-character room code and display name should not be represented as account-grade identity verification.

## 4. Required verification before a security pass can be claimed

- [ ] Merge reviewed PR and confirm GitHub Actions pass.
- [ ] Apply migration and verify the new function signature/ACLs in production.
- [ ] Deploy the Edge Function and confirm version and active status.
- [ ] Verify recovery rejects a wrong/missing previous token and accepts the correct previous token using disposable test rows in a rollback transaction.
- [ ] Verify the old token cannot access protected actions after recovery.
- [ ] Verify full-room deletion with disposable room data and confirm cascade removal across all related tables.
- [ ] Confirm the scheduled rate-limit cleanup job exists and run the cleanup function against disposable old bucket rows.
- [ ] Verify the Vercel production response headers, not just the configuration file.
- [ ] Run browser-based XSS payload checks and cross-room authorization tests.
- [ ] Commission an independent penetration test before describing Yarper as independently security-tested.

## 5. Conclusion

The live database access model has useful server-side controls and no direct anonymous/authenticated table grants were observed. A serious recovery weakness was found and a proof-of-possession fix has been prepared. Privacy deletion and several hardening changes are also prepared. **Yarper must not yet be described as fully security-passed, penetration-tested, or privacy-law compliant.** Those claims require the production deployment and verification items above, plus independent testing and legal review.
