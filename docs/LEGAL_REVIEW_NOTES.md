# Yarper — Provider and Jurisdiction Legal Review Notes

**Prepared:** 4 November 2026  
**Status:** Research notes only — not legal advice and not a compliance determination.

## 1. Known technical footprint

- Supabase project database region: eu-west-1 (Ireland).
- Vercel production deployment region reported for the current deployment: iad1 (US East). Vercel edge delivery and provider operations may involve additional regions.
- Supabase project is ACTIVE_HEALTHY and uses PostgreSQL 17.
- The application stores display names, room codes, device/session metadata, presence timestamps, prompts/answers, reactions, gameplay state and hashed IP-derived rate-limit buckets.
- No email, phone, GPS, date-of-birth or payment-card field was identified in the inspected application schema/source.
- The application does not currently publish a privacy notice or Terms; drafts are in PRIVACY_POLICY_DRAFT.md and TERMS_OF_SERVICE_DRAFT.md.

## 2. Supabase — facts to verify against the actual account agreement

Supabase's published Data Residency and Transfers FAQ says a project's primary database, Auth data, Storage objects and backups are hosted in the selected AWS region. It also describes account/billing data, support access, usage telemetry/logs and content delivery as processing categories that may occur outside that selected region. Supabase lists its DPA and current subprocessor list in its Legal Hub.

For Yarper, the primary database region is eu-west-1. Do not say all data remains in Ireland or the EU: provider support, account information, telemetry/logs and subprocessors may involve other locations.

Before sale or public launch:
- Confirm the Supabase account plan and backup retention applicable to this project.
- If the project is on a paid plan, confirm daily backup retention and any PITR setting. Supabase's published backup guide describes daily backups for Pro/Team/Enterprise plans and recommends regular off-site exports for Free projects.
- Review and accept the current Supabase DPA if appropriate to the actual plan/contract.
- Review the current subprocessor list and data transfer FAQ.
- Record how the buyer can export and restore the database, including provider backup limits.

Official references:
- https://supabase.com/legal/customer-resources/data-processing-addendum
- https://supabase.com/legal/customer-resources/subprocessor-list
- https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq
- https://supabase.com/docs/guides/platform/backups

## 3. Vercel — facts to verify against the actual account agreement

Vercel's published DPA (last updated 17 March 2026) states that it applies to customers on Pro and Enterprise plans and identifies the United States as Vercel's primary processing facilities, while allowing processing in locations where Vercel or subprocessors operate. The production deployment region iad1 does not establish the location of every request log, build artifact, support record or subprocessor.

Before sale or public launch:
- Confirm the Vercel plan and whether the published DPA applies to the account.
- Review the current Vercel subprocessor list and security materials.
- Check project build/deployment logs and any configured analytics or observability services.
- Record buyer transfer steps, plan cost and billing responsibilities.

Official references:
- https://vercel.com/legal/dpa
- https://vercel.com/legal
- https://security.vercel.com

## 4. Ghana-specific legal check

If the operator is established in Ghana or Yarper is offered to people in Ghana, obtain Ghana-specific legal advice before launch or sale. Ghana's Data Protection Act, 2012 (Act 843), section 46(3), states that a data controller shall register with the Data Protection Commission. Section 47 describes particulars required for a registration application, including business name/address, personal-data categories, purposes, recipients, transfer countries and security measures.

This technical review does not determine whether a particular individual, business, exemption or processing activity must register. A Ghana-qualified privacy lawyer or the Data Protection Commission should confirm the operator's obligations, registration, notices, data-subject rights, security safeguards and cross-border transfer requirements.

Official reference:
- https://dataprotection.org.gh/wp-content/uploads/2025/05/Data-Protection-Act-2012-Act-843.pdf

## 5. Decisions that cannot be made from technical evidence

The following remain open and are deliberately not invented:
- Legal operator name, legal form and address.
- Public privacy/support contact email.
- Countries where Yarper will be actively marketed.
- Minimum age (18+ is the recommended starting point for legal review, not a confirmed policy).
- Final inactive-room retention period.
- Applicable governing law and dispute forum.
- Whether any DPA is contractually available/required under the actual Supabase and Vercel plans.
- Whether a Ghana data-controller registration is required for the operator's actual circumstances.

## 6. Recommendation

Keep the privacy and Terms documents marked DRAFT and do not publish them with placeholders. The technical product controls are improved, but legal notices, operator identity, jurisdiction, provider contracts and retention decisions must be finalized before a privacy-compliance claim or public launch.
