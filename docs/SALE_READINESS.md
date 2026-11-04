# Yarper — Sale Readiness Checklist

Audit date: 4 November 2026.

## Verified

- [x] GitHub repository identified; repository is private.
- [x] Proprietary software notice exists in `LICENSE.md`.
- [x] Vercel production project identified; latest deployment observed READY.
- [x] Supabase project identified; status observed ACTIVE_HEALTHY.
- [x] Active Edge Function identified (version 18).
- [x] Five public application tables and private rate-limit storage inspected.
- [x] RLS enabled on all five public tables.
- [x] Direct public table grants were not present in the inspected grant listing.
- [x] RPC execute privileges inspected; application functions were restricted to service_role.
- [x] Database indexes, constraints and migration history inspected.
- [x] Production heartbeat polling issue identified and a tested reduction prepared on this branch.

## Not yet verified / required before closing

- [ ] Independent penetration test and full functional regression.
- [ ] Third-party software, font, image, icon and content licence inventory.
- [ ] Written evidence of IP assignment for any contractor/contributor work.
- [ ] Privacy policy, terms of service, retention and deletion workflow review.
- [ ] Identify whether stored records are test/demo data or real user data.
- [ ] Buyer-controlled staging deployment and end-to-end acceptance test.
- [ ] Confirm Vercel, Supabase, GitHub and domain transfer procedures.
- [ ] Rotate all credentials and secrets after transfer.
- [ ] Confirm operating costs, billing ownership and renewal dates.
- [ ] Signed asset schedule and acquisition agreement.

## Commercial facts

No verified revenue, paid customers, active-user analytics or independent valuation was available in this audit. The discussed USD 2,500 amount is only a proposed asking-price target. Do not advertise it as a verified valuation.

## Security advisor notes

Supabase returned informational RLS-without-policy notices for the five public tables. This reflects the inspected server-mediated architecture: RLS is on and public client grants were absent. Do not add broad client policies to silence these notices. Four unused-index notices were also reported; no indexes were dropped because current row counts are small and workload evidence is insufficient.
