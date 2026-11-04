#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077

: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL to the Supabase direct or session-pooler connection string}"
: "${BACKUP_AGE_RECIPIENT:?Set BACKUP_AGE_RECIPIENT to the public age recipient key}"

for bin in supabase age tar sha256sum; do
  command -v "$bin" >/dev/null 2>&1 || { echo "Missing required command: $bin" >&2; exit 1; }
done

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
root="${BACKUP_ROOT:-./backups}"
work="$(mktemp -d "${TMPDIR:-/tmp}/yarper-backup.XXXXXX")"
dest="$root/$stamp"
mkdir -p "$dest"
chmod 700 "$root" "$dest"

cleanup() {
  rm -rf "$work"
}
trap cleanup EXIT

# Supabase CLI runs pg_dump in a container; Docker must be available.
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$work/roles.sql" --role-only
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$work/schema.sql"
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$work/data.sql" --data-only --use-copy -x "storage.buckets_vectors" -x "storage.vector_indexes"

tar -czf "$work/yarper-backup.tar.gz" -C "$work" roles.sql schema.sql data.sql
age -r "$BACKUP_AGE_RECIPIENT" -o "$dest/yarper-backup.tar.gz.age" "$work/yarper-backup.tar.gz"
sha256sum "$dest/yarper-backup.tar.gz.age" > "$dest/SHA256SUMS"
chmod 600 "$dest/yarper-backup.tar.gz.age" "$dest/SHA256SUMS"

echo "Encrypted backup created at: $dest/yarper-backup.tar.gz.age"
echo "Copy the encrypted file and checksum to a separate, access-controlled off-site location."
echo "Do not commit backup files or connection strings to Git."
