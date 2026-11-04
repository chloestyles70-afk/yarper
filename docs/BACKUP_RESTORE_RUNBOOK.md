# Yarper — Backup and Restore Runbook

**Status:** Procedure prepared; no full production backup or restore drill has yet been executed.

## Why this is required

The Supabase organization is currently on the Free plan. Supabase's published backup guide says automatic daily database backups are available on Pro, Team and Enterprise plans; Free projects should regularly export their data with the Supabase CLI and maintain off-site backups.

The 15 SQL migrations reconstruct the application schema, but they do not contain live user records. A buyer handover needs a separate encrypted data backup and a tested restore.

## Required tools and secrets

- Supabase CLI (current stable version).
- Docker running locally (Supabase CLI uses a container for pg_dump).
- age encryption tool.
- A Supabase database connection string from the Dashboard's Connect panel. Use a session-pooler connection string if the network cannot connect to the direct IPv6 endpoint.
- A public age recipient key. Keep the private age identity offline and separate.
- A secure off-site storage location.

Never paste the database connection string or password into GitHub, chat, source files or a public listing.

## Create an encrypted backup

The repository includes scripts/backup-supabase.sh. Set these environment variables in a private terminal session:

- SUPABASE_DB_URL — database connection string.
- BACKUP_AGE_RECIPIENT — public age recipient key.
- Optional BACKUP_ROOT — local backup directory.

Then run:

```bash
bash scripts/backup-supabase.sh
```

The script:
1. Exports custom roles, schema and data separately using Supabase CLI.
2. Creates a compressed archive in a temporary directory.
3. Encrypts the archive with age.
4. Writes a SHA-256 checksum for the encrypted file.
5. Deletes the temporary plaintext SQL files on exit.

The encrypted output is local only. Copy it to an access-controlled off-site location and verify the checksum after upload. Do not commit backup archives to this repository.

## Restore into a buyer-controlled Supabase project

1. Create a new Supabase project in the intended region and record its database connection string securely.
2. Decrypt the backup using the private age identity:
   ```bash
   age -d -i /secure/path/age-identity.txt -o yarper-backup.tar.gz yarper-backup.tar.gz.age
   tar -xzf yarper-backup.tar.gz
   ```
3. Review roles.sql before applying it. Supabase-managed roles already exist in a new project; do not blindly recreate or alter built-in roles.
4. Apply the 15 repository migrations to the new empty project using the Supabase CLI migration workflow. Do not point a clean-room reset command at production.
5. Restore data.sql into the migrated schema using psql with ON_ERROR_STOP and a single transaction. If a schema-only restore is preferred instead, use schema.sql and do not also apply the same migrations.
6. Reapply and verify required function grants, RLS, Edge Function secrets and scheduled cron jobs. The migration files include the application changes, but provider secrets are not part of SQL dumps.
7. Deploy the Edge Function from the repository, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as server-side secrets, and deploy the Vercel frontend with the buyer's own accounts.
8. Run create/join, gameplay, recovery, room deletion and rate-limit tests using a disposable test couple.
9. Record the restore date, target project, migration versions, test results and any exclusions.

## Backup exclusions and caveats

- The Supabase CLI excludes managed schemas such as auth and storage; customizations to those schemas must be handled separately.
- Database dumps do not include Storage object files. No app-managed Storage objects were identified in the inspected Yarper source/schema.
- The default schema dump does not include data or custom roles; the script exports those separately.
- Provider logs, telemetry, Edge Function secrets, Vercel settings, domain registration and billing are not included.
- A backup is not proven usable until a restore drill has completed successfully.
- Keep at least one encrypted off-site copy and retain the decryption key separately.

## Current status

- [x] 15 applied migration files reconciled against live migration SQL.
- [x] Backup script and restore procedure prepared.
- [ ] Configure a secure database connection string and age recipient in a private environment.
- [ ] Run a full encrypted production backup.
- [ ] Upload the encrypted backup off-site.
- [ ] Restore into a separate buyer-controlled project and verify application behavior.
