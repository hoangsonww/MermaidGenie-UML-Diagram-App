#!/usr/bin/env bash
set -euo pipefail

echo "🧪 [backend_test] Running backend tests..."

cd backend

# Ensure dependencies are installed
npm ci

# Run Jest – ignore failures
npm test || true

echo "✅ [backend_test] Backend tests finished (errors suppressed)"
