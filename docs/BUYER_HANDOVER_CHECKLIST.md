# Yarper — Buyer Handover Checklist

This checklist is intended to guide a buyer through a controlled transfer. It is not a substitute for an acquisition agreement, legal advice or a completed restore test.

## 1. Before signing

- [ ] Verify seller identity and authority to transfer the repository, app code, database and any domain or provider resources.
- [ ] Review the commit/contributor history and obtain a signed declaration covering authorship, assignments and third-party assets.
- [ ] Review `docs/THIRD_PARTY_ASSET_REGISTER.md` and verify the rights to the icon, game prompts/copy and any other supplied content.
- [ ] Review the dependency inventory in `docs/DEPENDENCY_INVENTORY.md`; obtain a complete transitive SBOM and license review.
- [ ] Review the privacy and terms drafts; complete operator identity, contact, jurisdictions, minimum age, retention and governing-law details with qualified legal advice.
- [ ] Agree whether existing room/member/answer data will be transferred, deleted or anonymized. Do not include raw user records in public sales materials.
- [ ] Agree on price, included assets, liabilities, support period, transition assistance and post-sale responsibilities in a signed agreement.

## 2. Buyer-controlled accounts

- [ ] Buyer creates or identifies their own GitHub, Vercel and Supabase accounts/organizations.
- [ ] Confirm the buyer can receive the repository and use their own billing and payment methods.
- [ ] Agree how the domain will be transferred, if a domain is included; verify registrar rules and ownership separately.
- [ ] Do not transfer the seller's personal account password, personal access token, recovery email or billing credentials.
- [ ] Transfer supported project/repository ownership or recreate resources under buyer-controlled accounts.
- [ ] Rotate all deployment secrets, database passwords, API keys, access tokens and integration credentials after transfer.

## 3. Database and application acceptance

- [ ] Receive the encrypted database backup and checksum through a secure channel, if transfer of existing data is agreed.
- [ ] Receive the private age decryption identity through a separate secure channel; never store it beside the backup.
- [ ] Verify the checksum, decrypt and inspect the archive in a restricted environment.
- [ ] Restore to a new buyer-controlled Supabase project using `docs/BACKUP_RESTORE_RUNBOOK.md`.
- [ ] Apply the repository migrations to the new project; do not run remote reset commands against production.
- [ ] Restore data only after the schema/migrations are applied; review custom roles and grants before enabling traffic.
- [ ] Configure Edge Function secrets and deploy the function from repository source.
- [ ] Deploy the frontend to the buyer's Vercel project and connect the buyer-controlled domain.
- [ ] Run dated two-device tests for create/join, recovery, turn-taking, answer submission, rewards, daily/streak state, deletion and rate limiting.
- [ ] Verify actual production HTTP security headers and perform browser/XSS testing.
- [ ] Verify monitoring, backups, retention and incident-response contacts.

## 4. Handover evidence

- [ ] Repository commit and release/tag handed over.
- [ ] Database migration version and restore date recorded.
- [ ] Test evidence and known limitations handed over.
- [ ] Provider region, service plan, billing and renewal details recorded.
- [ ] Current secrets rotated and confirmed working without seller-owned credentials.
- [ ] Data-transfer/deletion record signed by both parties.
- [ ] Asset schedule and signed acquisition/transfer agreement completed.
- [ ] Support handover completed and access removed from seller accounts as agreed.

## Current known blockers

- No production backup, off-site copy or restore drill has been completed.
- No independent penetration test or complete browser-based two-device acceptance test has been completed by the reviewer.
- Privacy and Terms drafts are unpublished and need operator/jurisdiction details plus legal review.
- Third-party asset rights and contributor IP assignments still need documentary verification.
- The dependency inventory is direct-source scope only; complete transitive SBOM and license review remain outstanding.
- Yarper is pre-revenue; no verified revenue, paying-customer count or retention cohort has been supplied.
