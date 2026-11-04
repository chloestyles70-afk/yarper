# Yarper — Sale Readiness Checklist

Audit date: 4 November 2026. This checklist combines previously recorded infrastructure observations with a fresh static inspection of the GitHub repository on the sale-readiness branch. Items are marked verified only where evidence was available.

## Confirmed from repository inspection

- [x] GitHub repository identified: chloestyles70-afk/yarper; it is private.
- [x] A proprietary software notice exists in LICENSE.md.
- [x] The repository contains a live-app frontend, a sync scheduler, one scheduler test, a manifest, an SVG icon and buyer-facing documentation.
- [x] The frontend is a static single-page HTML/CSS/JavaScript application; most application logic is inline in index.html.
- [x] The frontend calls a Supabase Edge Function endpoint and stores a per-device session token in browser localStorage.
- [x] User-controlled strings rendered into HTML are escaped in the inspected dynamic rendering paths.
- [x] The repository now has a minimal npm test script and a GitHub Actions workflow for the existing Node.js unit tests on pushes to the readiness branch and pull requests to main.
- [x] Functional test plan, security policy and third-party asset/licence register have been added.

## Previously recorded infrastructure observations — recheck before listing

The following were recorded in an earlier infrastructure review dated 4 November 2026; they were not independently re-queried during this static repository review:

- Vercel production project was observed in READY state.
- Supabase project was observed ACTIVE_HEALTHY; Edge Function yarper-api was reported at version 18.
- Five public application tables and a private rate-limit table were reported.
- RLS was reported enabled on the five public tables, with no direct anon/authenticated table grants in the inspected grant listing.
- Application RPC execution was reported restricted to service_role.
- Database indexes, constraints and migration history were previously inspected.

Treat those observations as dated snapshots, not permanent guarantees. Recheck current deployment health, access grants, function version, migrations, billing and ownership before closing a sale.

## Findings and risks from current repository review

- [ ] **Backend source is not included in this repository.** The Edge Function implementation, migrations and server-side validation cannot be audited from the checked-in source. Export/review the backend source and migrations before making a complete code-quality or security claim.
- [ ] **Single-file frontend structure.** Application HTML, CSS and substantial JavaScript are concentrated in index.html. This is deployable but makes maintenance, review and regression testing harder. A refactor is optional; do not introduce release risk merely for appearance.
- [ ] **Session token storage.** The browser stores the device token in localStorage. Review XSS exposure, token expiry/revocation and server-side authorization. Consider a safer session architecture before a broader commercial release.
- [ ] **Content Security Policy.** No Content-Security-Policy meta/header was visible in the inspected repository files. Check Vercel response headers and introduce a compatible policy after testing inline script/style requirements.
- [ ] **Automated test coverage is narrow.** The only checked-in test covers the sync scheduler. Core multiplayer and reward behavior require repeatable end-to-end and backend tests.
- [ ] **No dependency lockfile or full dependency inventory.** No npm runtime dependencies were declared before this branch. Confirm whether any code or assets came from external sources or were added outside this repository.
- [ ] **No privacy policy or terms document was found in the repository tree.** Confirm whether these exist elsewhere and make them accessible before public listing/operation.
- [ ] **No completed third-party rights inventory.** Owner confirmation and evidence are still required.
- [ ] **No independent penetration test or complete functional regression is evidenced.**
- [ ] **Data classification is incomplete.** Existing database rows must be classified as test/demo or genuine user data before any buyer access or transfer.

## Required before publishing the Flippa listing

- [ ] Run npm test locally and confirm the GitHub Actions workflow passes.
- [ ] Complete the full two-device functional test plan and retain dated evidence.
- [ ] Review the full backend function source, migrations, database grants and provider configuration.
- [ ] Complete third-party code, font, image, icon, prompt and media licence inventory.
- [ ] Obtain written IP assignment evidence for all contributors, if any.
- [ ] Confirm product is not a purchased template, marketplace script or minimally modified reskin.
- [ ] Add/review privacy policy, terms, data retention and deletion process.
- [ ] Identify and lawfully remove, anonymize or transfer existing personal data.
- [ ] Verify production hosting, domain, database and billing transfer procedures.
- [ ] Prepare buyer-controlled staging deployment and acceptance test.
- [ ] Document operating costs, subscriptions, renewals and post-sale support scope.
- [ ] Prepare signed asset schedule and acquisition agreement.

## Commercial facts

Yarper is pre-revenue. No verified revenue, paying-customer count, active-user analytics, retention cohort or independent valuation has been supplied. Asking prices are seller-set negotiation positions, not appraisals. Do not describe the product as revenue-generating, established, bug-free, independently security-certified or proven to retain users without evidence.

## Scope limitation

This is a repository and documentation readiness review, not a legal opinion, full code audit, penetration test, privacy compliance audit or independent valuation. The backend source and production data contents were not available in the current review.
