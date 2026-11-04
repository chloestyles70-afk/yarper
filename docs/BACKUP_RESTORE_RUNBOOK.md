# Yarper — Backup and Restore Runbook

**Status:** Hardened backup script and procedure prepared. Shell syntax and static checks are required before use. No full production backup or restore drill has yet been executed.

## Why this is required

The Supabase organization is currently on the Free plan. Supabase's backup guidance describes managed daily database backups for paid plans; do not assume a Free project has an automatic daily backup. The repository's migration history reconstructs the application schema, but it does not contain live user records.

A buyer handover needs a separate encrypted data backup and a tested restore.

## Required tools and secrets

- Current Supabase CLI.
- Docker running locally. The Supabase CLI runs `pg_dump` in a container for `db dump`.
- `age` encryption tool.
- A Supabase database connection string from the Dashboard's Connect panel. Use a session-pooler connection string if the network cannot connect to the direct IPv6 endpoint.
- A public age recipient key. Keep the matching private age identity offline and separate.
- A secure off-site storage location with restricted access.

Never paste the database connection string or password into GitHub, chat, source files or a public listing. Do not store the private age identity beside the encrypted backup.

## Preflight and create an encrypted backup

The repository includes `scripts/backup-supabase.sh`. Set these environment variables in a private terminal session:

- `SUPABASE_DB_URL` — PostgreSQL connection string.
- `BACKUP_AGE_RECIPIENT` — public age recipient key.
- Optional `BACKUP_ROOT` — local backup directory (defaults to `./backups`).

Run:

```bash
bash -n scripts/backup-supabase.sh
bash scripts/backup-supabase.sh
```

Before exporting data, the script checks required commands, verifies that Docker is running, validates the PostgreSQL URL scheme and tests the age recipient by encrypting an empty temporary input. It creates a unique, owner-only output directory to avoid same-second backup collisions.

The script then:
1. Exports cluster roles, schema and data separately using the Supabase CLI.
2. Checks that all three SQL exports exist and are non-empty.
3. Creates a compressed archive in a temporary directory.
4. Encrypts the archive with age.
5. Writes and verifies a SHA-256 checksum for the encrypted file.
6. Deletes the temporary plaintext export and archive on exit.

The output is local only. Copy both the encrypted archive and checksum to a separate, access-controlled off-site location. Verify the checksum again after upload. Do not commit backup archives to this repository.

A successful script run confirms that an encrypted export was created and its checksum verified. It does **not** prove that the archive can be restored.

## Restore into a buyer-controlled Supabase project

Perform this only against a newly created, buyer-controlled project—not production.

1. Create a new Supabase project in the intended region and securely record its database connection string.
2. Verify the encrypted archive before decrypting:
   ```bash
   sha256sum -c SHA256SUMS
   ```
   Run this from the directory containing the encrypted archive and checksum.
3. Decrypt using the private age identity:
   ```bash
   age -d -i /secure/path/age-identity.txt -o yarper-backup.tar.gz yarper-backup.tar.gz.age
   mkdir yarper-restore
   tar -xzf yarper-backup.tar.gz -C yarper-restore
   ```
4. Review `roles.sql` manually. Supabase-managed roles already exist in a new project; do not blindly recreate or alter built-in roles. Only apply verified custom-role statements that the target project actually needs.
5. In a clean checkout of the repository, link the Supabase CLI to the buyer's new project:
   ```bash
   supabase link --project-ref <buyer-project-ref>
   ```
6. Preview the repository migrations, then apply them:
   ```bash
   supabase db push --dry-run
   supabase db push
   ```
   Confirm the linked project is the new buyer-controlled project before proceeding. Never use `supabase db reset --linked` or a remote reset command for this workflow.
7. Restore the exported application data into the migrated schema using `psql` with error-stop and single-transaction behavior:
   ```bash
   psql "$TARGET_DB_URL" --set ON_ERROR_STOP=on --single-transaction --file yarper-restore/data.sql
   ```
   Do not also restore `schema.sql` when applying the repository migrations; that would duplicate schema creation. Treat `schema.sql` as a reference/fallback artifact, not a second schema-restore step.
8. Reapply and verify required function grants, RLS, Edge Function secrets and scheduled cron jobs. Provider secrets are not included in SQL dumps.
9. Deploy the Edge Function from the repository, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as server-side secrets, and deploy the Vercel frontend with the buyer's own accounts.
10. Run create/join, gameplay, recovery, room deletion and rate-limit tests using a disposable test couple.
11. Record the restore date, target project, migration versions, test results and any exclusions. Remove temporary plaintext exports securely after acceptance.

## Backup exclusions and caveats

- Supabase CLI dumps exclude managed schemas such as `auth`, `storage`, and schemas created by extensions. Do not assume this archive contains Auth users or Storage object files.
- No app-managed Storage objects were identified in the inspected Yarper source/schema. Recheck before transfer.
- The database dump does not include provider logs, telemetry, Edge Function secrets, Vercel settings, domain registration or billing.
- A restore is not proven until a clean buyer-controlled project has been restored and the application flows have been tested.
- Keep at least one encrypted off-site copy and retain the decryption key separately.
- Supabase documents that tables in a new project may inherit default privileges. Review target default privileges and application grants before exposing the restored project; do not assume the dump alone reproduces every platform setting.

## Current status

- [x] 15 applied migration files reconciled against live migration SQL.
- [x] Backup script and restore procedure prepared.
- [x] Script hardened with Docker, tool and recipient preflight; unique output directory; non-empty dump checks; checksum verification.
- [ ] Run local shell/static checks on the revised script.
- [ ] Configure a secure database connection string and age recipient in a private environment.
- [ ] Run a full encrypted production backup.
- [ ] Upload the encrypted backup off-site.
- [ ] Restore into a separate buyer-controlled project and verify application behavior.
