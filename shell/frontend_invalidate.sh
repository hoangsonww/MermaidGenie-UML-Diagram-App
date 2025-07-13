#!/usr/bin/env bash
set -euo pipefail

DIST_ID=${1:?You must provide a CloudFront distribution ID}
echo "🔄 Invalidating CloudFront distribution $DIST_ID..."

aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*"

echo "✅ Invalidation requested."
