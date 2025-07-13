#!/usr/bin/env bash
set -euo pipefail

# usage: ./deploy.sh [bucket-name]
BUCKET=${1:?Bucket name required}
echo "Building and deploying frontend to S3 bucket: $BUCKET"

# build Next.js for static export
cd ../..                         # project root
npm ci
npm run build
npm run export                   # outputs to out/

# sync to S3
aws s3 sync out/ "s3://$BUCKET" \
  --delete \
  --acl public-read

echo "Deployment complete. You can serve from https://$BUCKET.s3.amazonaws.com"
