#!/usr/bin/env bash
# Per-boot startup for StockSim: ensure the PostgreSQL cluster is running and
# ready. Dependency install and schema creation happen in install.sh, not here.
set -euo pipefail

PG_VERSION="$(ls /etc/postgresql 2>/dev/null | sort -V | tail -1)"
PG_VERSION="${PG_VERSION:-16}"

sudo pg_ctlcluster "$PG_VERSION" main start 2>/dev/null || true

# Wait until Postgres accepts connections before returning.
for i in $(seq 1 30); do
  if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "PostgreSQL is ready."
    exit 0
  fi
  sleep 1
done

echo "PostgreSQL did not become ready in time." >&2
exit 1
