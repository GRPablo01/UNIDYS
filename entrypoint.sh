#!/bin/sh
set -e

if [ ! -d "node_modules" ]; then
  echo "==> Installation des dépendances npm (front)..."
  npm ci
fi

echo "==> Lancement du serveur Angular"
exec "$@"
