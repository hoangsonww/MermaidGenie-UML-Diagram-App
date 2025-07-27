#!/usr/bin/env bash
set -euo pipefail

# usage: ./deploy.sh [stage]
STAGE=${1:-dev}
echo "Deploying backend to AWS (stage=$STAGE)..."

# install deps & build
cd ../../
npm ci
npm run build

# deploy
cd aws/backend
serverless deploy --stage "$STAGE"
