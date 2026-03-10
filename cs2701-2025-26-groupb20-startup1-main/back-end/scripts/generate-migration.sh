#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "" ]]; then
  echo "Usage: ./scripts/generate-migration.sh <migration_name>"
  exit 1
fi

MIGRATION_NAME="$(echo "$1" | tr '[:space:]' '_' | tr -cd '[:alnum:]_-')"
TIMESTAMP="$(date -u +%Y%m%d%H%M%S)"
OUTPUT_FILE="src/main/resources/db/changelog/generated/${TIMESTAMP}_${MIGRATION_NAME}.yaml"

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-artxplore}"
DB_USER="${DB_USER:-artxplore}"
DB_PASSWORD="${DB_PASSWORD:-artxplore}"

mvn -q \
  -DskipTests \
  -Dliquibase.url="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}" \
  -Dliquibase.username="${DB_USER}" \
  -Dliquibase.password="${DB_PASSWORD}" \
  -Dliquibase.diffChangeLogFile="${OUTPUT_FILE}" \
  process-classes \
  liquibase:diffChangelog

echo "Generated migration: ${OUTPUT_FILE}"
