#!/bin/sh
set -e

# Run Prisma migrations against the production database.
# This ensures the schema is up-to-date before the app starts accepting traffic.
# The Prisma CLI is available at node_modules/prisma/ (copied from builder stage).
echo "[entrypoint] Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma 2>&1 || {
  echo "[entrypoint] WARNING: Migration failed. The app will still start, but the schema may be out of sync."
  echo "[entrypoint] Check DATABASE_URL / DIRECT_URL and ensure the database is reachable."
}

echo "[entrypoint] Starting application..."
exec "$@"
