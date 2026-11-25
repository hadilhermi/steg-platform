#!/bin/sh
set -eu

backup_dir=${BACKUP_DIR:-/backups}
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
archive="$backup_dir/steg_platform-$timestamp.archive.gz"

mkdir -p "$backup_dir"
mongodump \
  --uri="$MONGODB_URI" \
  --archive="$archive" \
  --gzip

printf 'MongoDB backup created: %s\n' "$archive"
