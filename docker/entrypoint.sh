#!/bin/sh
set -e

# ──────────────────────────────────────────────────────────
# Docker Secrets → Environment Variable Bridge
# ──────────────────────────────────────────────────────────
# Reads secret files from /run/secrets/ and exports them as
# environment variables. If no secret file exists, falls back
# to whatever env var is already set (dev mode via .env).
# ──────────────────────────────────────────────────────────

read_secret() {
  # Usage: read_secret ENV_VAR_NAME secret_file_name
  local var_name="$1"
  local secret_file="/run/secrets/$2"

  if [ -f "$secret_file" ]; then
    export "$var_name"="$(cat "$secret_file" | tr -d '\n')"
    echo "[entrypoint] Loaded secret: $2 → $var_name"
  fi
}

# ─── Read all secrets ──────────────────────────────────────
read_secret "POSTGRES_PASSWORD" "db_password"
read_secret "JWT_SECRET"        "jwt_secret"
read_secret "JWT_REFRESH_SECRET" "jwt_refresh_secret"
read_secret "AADHAR_SALT"       "aadhar_salt"

# ─── Build DATABASE_URL dynamically from components ────────
# If db_password secret was loaded, reconstruct DATABASE_URL
# so the plain-text password is never in compose/env files.
if [ -f /run/secrets/db_password ]; then
  DB_USER="${POSTGRES_USER:-postgres}"
  DB_PASS="$(cat /run/secrets/db_password | tr -d '\n')"
  DB_HOST="${POSTGRES_HOST:-db}"
  DB_PORT="${POSTGRES_PORT:-5432}"
  DB_NAME="${POSTGRES_DB:-triggerhub}"

  export DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
  echo "[entrypoint] DATABASE_URL constructed from secrets"
fi

# ─── Run Prisma migrations if requested ───────────────────
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "[entrypoint] Running Prisma migrations..."
  npx prisma migrate deploy
fi

# ─── Execute the main process ─────────────────────────────
echo "[entrypoint] Starting application..."
exec "$@"
