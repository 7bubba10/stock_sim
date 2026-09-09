#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for StockSim.
# Installs PostgreSQL (if missing), project dependencies, creates the dev
# database + role, loads the schema, and writes local env files if absent.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# --- System dependency: PostgreSQL ---
if ! command -v psql >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y --no-install-recommends postgresql postgresql-contrib
fi

PG_VERSION="$(ls /etc/postgresql 2>/dev/null | sort -V | tail -1)"
PG_VERSION="${PG_VERSION:-16}"

# Start the cluster so we can provision the role/database (idempotent).
sudo pg_ctlcluster "$PG_VERSION" main start 2>/dev/null || true

# --- Database role + database (idempotent) ---
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='stocksim'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE ROLE stocksim LOGIN PASSWORD 'stocksim'"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='stocksim'" | grep -q 1 \
  || sudo -u postgres createdb -O stocksim stocksim

# --- Project dependencies ---
( cd server && npm install )
( cd client && npm install )

# --- Schema (schema.sql uses CREATE TABLE IF NOT EXISTS, so it is idempotent) ---
PGPASSWORD=stocksim psql -h localhost -U stocksim -d stocksim -f server/src/db/schema.sql

# --- Server env file ---
# External API keys (Alpaca / Polygon) are intentionally left blank here so that
# any values injected as Cloud Agent secrets take precedence at runtime (dotenv
# does not override existing environment variables).
if [ ! -f server/.env ]; then
  cat > server/.env <<'EOF'
PORT=3001
DATABASE_URL=postgresql://stocksim:stocksim@localhost:5432/stocksim
JWT_SECRET=dev_local_jwt_secret_change_me
ALPACA_API_KEY=
ALPACA_SECRET_KEY=
ALPACA_BASE_URL=https://paper-api.alpaca.markets
POLYGON_API_KEY=
EOF
fi

# --- Client env file (points the frontend at the local backend) ---
if [ ! -f client/.env.local ]; then
  echo "VITE_API_URL=http://localhost:3001" > client/.env.local
fi

echo "StockSim install complete."
