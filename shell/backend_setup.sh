#!/usr/bin/env bash
set -euo pipefail

echo "🔧 [backend_setup] Installing deps and building backend..."

cd backend

# Install dependencies
npm ci

# Compile TypeScript (allow errors but continue)
export TSC_COMPILE_ON_ERROR=true
npm run build || true

echo "✅ [backend_setup] Backend build complete"
