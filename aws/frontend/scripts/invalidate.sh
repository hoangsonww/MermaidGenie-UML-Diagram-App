#!/usr/bin/env bash
set -euo pipefail

# usage: ./invalidate.sh [distribution-id]
DIST_ID=${1:?CloudFront Distribution ID required}
echo "Invalidating CloudFront cache for distribution: $DIST_ID"

aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*"

echo "Invalidation requested."
