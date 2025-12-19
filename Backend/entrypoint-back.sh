#!/bin/sh
set -e

if [ ! -d "/app/node_modules" ] || [ -z "$(ls -A /app/node_modules 2>/dev/null)" ]; then
  echo "==> Installation des dépendances npm (back)..."
  cd /app
  npm ci
fi

echo "==> Lancement du serveur Node.js"
exec "$@"
