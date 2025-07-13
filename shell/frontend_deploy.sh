#!/usr/bin/env bash
set -euo pipefail

BUCKET=${1:?You must provide an S3 bucket name}
echo "🚀 Building and deploying frontend to S3://$BUCKET..."

# Build & export Next.js
npm ci
npm run build
npm run export

# Sync to S3
aws s3 sync out/ "s3://$BUCKET" --delete --acl public-read

echo "✅ Frontend deployed. Accessible at https://$BUCKET.s3.amazonaws.com"
