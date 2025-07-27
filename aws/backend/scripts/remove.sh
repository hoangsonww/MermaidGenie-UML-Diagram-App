#!/usr/bin/env bash
set -euo pipefail

# usage: ./remove.sh [stage]
STAGE=${1:-dev}
echo "Removing backend stack (stage=$STAGE)..."

cd aws/backend
serverless remove --stage "$STAGE"
