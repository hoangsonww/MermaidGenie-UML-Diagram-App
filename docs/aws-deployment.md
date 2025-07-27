# ☁️ AWS Deployment Guide

This document explains how to deploy **MermaidGenie**’s backend (AWS Lambda via Serverless Framework) and frontend (S3 + CloudFront) using the files in the `aws/` directory.

---

## 📁 Directory Layout

```
aws/
├── backend/
│   ├── serverless.yml
│   └── scripts/
│       ├── deploy.sh
│       └── remove.sh
└── frontend/
└── scripts/
├── deploy.sh
└── invalidate.sh
```

---

## 🔧 Prerequisites

1. **AWS CLI** v2 installed and configured (`aws configure`).
2. **Node.js** & **npm** (≥14) installed.
3. **Serverless Framework** installed globally:

   ```bash
   npm install -g serverless
   ```

4. You have created an S3 bucket and a CloudFront distribution for the frontend, or will let Terraform / manual console do that.
5. Environment variables (export or in a `.env` file sourced before running scripts):

   ```bash
   export AWS_REGION="us-east-1"
   export MONGO_URI="mongodb+srv://..."
   export JWT_SECRET="supersecret"
   export OPENAI_API_KEY="sk-..."
   export FRONTEND_BUCKET="mermaidgenie-frontend-$STAGE"
   export CLOUDFRONT_DIST_ID="E123ABCDEF..."
   ```

---

## ▶️ Backend Deployment

All backend resources (API, Lambdas, IAM roles) are defined in `aws/backend/serverless.yml`.

### 1. serverless.yml

- **Service**: `mermaidgenie-api`
- **Provider**: AWS Lambda (Node.js 18.x)
- **Functions**:
  - `app` (Express handler)

- **Environment**: Uses `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`
- **Plugins**: `serverless-webpack` / others as configured

### 2. scripts/deploy.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh [stage]
STAGE="${1:-dev}"

# Ensure required env vars are set:
: "${MONGO_URI:?Need MONGO_URI}"
: "${JWT_SECRET:?Need JWT_SECRET}"
: "${OPENAI_API_KEY:?Need OPENAI_API_KEY}"

echo "🚀 Deploying backend (stage: $STAGE)..."
cd "$(dirname "$0")/.."
serverless deploy --stage "$STAGE" --region "$AWS_REGION"
echo "✅ Backend deployed!"
```

Make it executable:

```bash
chmod +x aws/backend/scripts/deploy.sh
```

### 3. scripts/remove.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Usage: ./remove.sh [stage]
STAGE="${1:-dev}"
echo "🗑 Removing backend stack (stage: $STAGE)..."
cd "$(dirname "$0")/.."
serverless remove --stage "$STAGE" --region "$AWS_REGION"
echo "✅ Backend removed!"
```

Make it executable:

```bash
chmod +x aws/backend/scripts/remove.sh
```

---

## ▶️ Frontend Deployment

We host the static Next.js export in S3 and serve via CloudFront.

### 1. scripts/deploy.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh [stage]
STAGE="${1:-dev}"
: "${FRONTEND_BUCKET:?Need FRONTEND_BUCKET}"
echo "🌐 Building & exporting frontend for stage: $STAGE..."
cd "$(dirname "$0")/../../frontend"
npm install
npm run build
npm run export

echo "📤 Syncing to S3 bucket: $FRONTEND_BUCKET..."
aws s3 sync out/ "s3://$FRONTEND_BUCKET" \
  --region "$AWS_REGION" \
  --delete

echo "✅ Frontend deployed to S3!"
```

Make it executable:

```bash
chmod +x aws/frontend/scripts/deploy.sh
```

### 2. scripts/invalidate.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Usage: ./invalidate.sh [stage]
STAGE="${1:-dev}"
: "${CLOUDFRONT_DIST_ID:?Need CLOUDFRONT_DIST_ID}"
echo "🚨 Creating CloudFront invalidation for dist: $CLOUDFRONT_DIST_ID..."
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DIST_ID" \
  --paths "/*"
echo "✅ Invalidation submitted!"
```

Make it executable:

```bash
chmod +x aws/frontend/scripts/invalidate.sh
```

---

## 🚀 End‑to‑End Deployment

1. **Set your environment** (or source an `aws/.env`):

   ```bash
   export AWS_REGION="us-east-1"
   export MONGO_URI="..."
   export JWT_SECRET="..."
   export OPENAI_API_KEY="..."
   export FRONTEND_BUCKET="mermaidgenie-frontend-dev"
   export CLOUDFRONT_DIST_ID="E123ABCDEF"
   ```

2. **Deploy backend**:

   ```bash
   cd aws/backend/scripts
   ./deploy.sh dev
   ```

3. **Deploy frontend**:

   ```bash
   cd ../../frontend/scripts
   ./deploy.sh dev
   ./invalidate.sh dev
   ```

4. 🎉 **MermaidGenie** is now live!

- **API URL** from Serverless output
- **Web URL**: `https://$CLOUDFRONT_DIST_ID.cloudfront.net`

---

## 🗑 Cleanup

To tear down the backend stack:

```bash
cd aws/backend/scripts
./remove.sh dev
```

To clear your S3 bucket (optional):

```bash
aws s3 rm s3://$FRONTEND_BUCKET --recursive --region "$AWS_REGION"
```

---

## 🔄 CI/CD Integration

You can integrate these scripts into your GitHub Actions or other CI pipelines:

- **Backend**: run `aws/backend/scripts/deploy.sh ${{ matrix.stage }}`
- **Frontend**: run `aws/frontend/scripts/deploy.sh ${{ matrix.stage }}` then `invalidate.sh`

Store sensitive values (`MONGO_URI`, `JWT_SECRET`, etc.) securely in your CI secrets.

---

That's it—your AWS infrastructure and static site are fully automated. Enjoy sharing AI‑powered diagramming with the world!
