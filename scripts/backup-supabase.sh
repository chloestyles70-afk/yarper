#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077

: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL to the Supabase direct or session-pooler connection string}"
: "${BACKUP_AGE_RECIPIENT:?Set BACKUP_AGE_RECIPIENT to the public age recipient key}"

# Check all local prerequisites before starting a database export.
for bin in supabase age tar sha256sum docker; do
  command -v "$bin" >/dev/null 2>&1 || { echo "Missing required command: $bin" >&2; exit 1; }
done

case "$SUPABASE_DB_URL" in
  postgres://*|postgresql://*) ;;
  *) echo "SUPABASE_DB_URL must be a PostgreSQL connection string." >&2; exit 1 ;;
esac

if ! docker info >/dev/null 2>&1; then
  echo "Docker is installed but its daemon is not available. Start Docker and retry." >&2
  exit 1
fi

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
root="${BACKUP_ROOT:-./backups}"
work="$(mktemp -d "${TMPDIR:-/tmp}/yarper-backup.XXXXXX")"
dest=""

cleanup() {
  rm -rf "$work"
}
trap cleanup EXIT

# Validate the public recipient before exporting any production data.
if ! printf '' | age -r "$BACKUP_AGE_RECIPIENT" -o "$work/recipient-check.age" >/dev/null 2>&1; then
  echo "BACKUP_AGE_RECIPIENT is not a valid age recipient." >&2
  exit 1
fi
rm -f "$work/recipient-check.age"

mkdir -p "$root"
# Unique directory prevents same-second runs from overwriting a prior backup.
dest="$(mktemp -d "$root/$stamp.XXXXXX")"
chmod 700 "$dest"

echo "Starting encrypted Supabase export..."
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$work/roles.sql" --role-only
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$work/schema.sql"
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$work/data.sql" --data-only --use-copy -x "storage.buckets_vectors" -x "storage.vector_indexes"

for dump in roles.sql schema.sql data.sql; do
  if [[ ! -s "$work/$dump" ]]; then
    echo "Expected export is missing or empty: $dump" >&2
    exit 1
  fi
done

tar -czf "$work/yarper-backup.tar.gz" -C "$work" roles.sql schema.sql data.sql
age -r "$BACKUP_AGE_RECIPIENT" -o "$dest/yarper-backup.tar.gz.age" "$work/yarper-backup.tar.gz"
sha256sum "$dest/yarper-backup.tar.gz.age" > "$dest/SHA256SUMS"
chmod 600 "$dest/yarper-backup.tar.gz.age" "$dest/SHA256SUMS"
(cd "$dest" && sha256sum -c SHA256SUMS)

echo "Encrypted backup created at: $dest/yarper-backup.tar.gz.age"
echo "Copy the encrypted file and checksum to a separate, access-controlled off-site location."
echo "Do not commit backup files or connection strings to Git."
