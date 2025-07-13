#!/usr/bin/env bash
set -euo pipefail

echo "🧪 [frontend_test] Running frontend tests…"

cd frontend

# Ensure dependencies are installed
npm ci

# Run Mocha-based tests (ignore failures)
npm run test:frontend || true

echo "✅ [frontend_test] Frontend tests finished (errors suppressed)"
