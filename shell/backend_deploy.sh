#!/usr/bin/env bash
set -euo pipefail

STAGE=${1:-dev}
echo "🏗  Building and deploying backend (stage=$STAGE)..."

# Build your backend
npm ci
npm run build

# Deploy via Serverless Framework
cd aws/backend
serverless deploy --stage "$STAGE"
