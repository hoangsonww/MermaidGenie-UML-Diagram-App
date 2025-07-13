# ==============================================================================
# Makefile for MermaidGenie Project
#
# This Makefile centralizes common development, test, build, and deployment tasks
# for both the backend (Express + TypeScript) and frontend (Next.js) applications.
# It provides a simple interface to manage dependencies, run tests, build artifacts,
# and deploy to AWS services like S3 and CloudFront, and more.
#
# Feel free to customize the targets and variables as needed.
#
# Usage:
#   make <target> [VARIABLE=value]
#
# Variables (override on the command line):
#   STAGE    - Deployment stage for backend (default: dev)
#   BUCKET   - S3 bucket name for frontend deployment
#   DIST_ID  - CloudFront distribution ID for cache invalidation
#
# Common targets:
#   help                  Show this help message
#   build                 Build both backend and frontend
#   test                  Run backend (jest) and frontend (mocha) tests
#   lint                  Run frontend linter
#   format                Run code formatter in root
#
# Backend targets:
#   backend-setup         Install deps & build backend locally
#   backend-test          Run backend tests (errors suppressed)
#   backend-deploy        Build & deploy backend to AWS via Serverless (pass STAGE)
#   backend-remove        Remove backend stack from AWS (pass STAGE)
#
# Frontend targets:
#   frontend-setup        Install deps & build frontend locally
#   frontend-test         Run frontend tests (errors suppressed)
#   frontend-deploy       Build & deploy frontend to S3 (pass BUCKET)
#   frontend-invalidate   Invalidate CloudFront distribution (pass DIST_ID)
#
# Examples:
#   make build
#   make test
#   make backend-deploy STAGE=prod
#   make frontend-deploy BUCKET=my-bucket
#   make frontend-invalidate DIST_ID=E123456789
#
# ==============================================================================

SHELL := bash
.DEFAULT_GOAL := help

# override on CLI:
STAGE      ?= dev
BUCKET     ?= your-s3-bucket
DIST_ID    ?= your-cloudfront-id

.PHONY: help build test lint format \
        backend-setup backend-test backend-deploy backend-remove \
        frontend-setup frontend-test frontend-deploy frontend-invalidate

help:            ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build:           ## Build both backend & frontend
	cd backend  && npm ci && npm run build
	cd frontend && npm ci && npm run build

test:            ## Run backend + frontend tests
	cd backend  && npm test
	cd frontend && npm run test:frontend

lint:            ## Run linters (frontend)
	cd frontend && npm run lint

format:          ## Run formatters (root)
	npm run format

# Backend convenience
backend-setup:   ## Install & build backend
	shell/backend_setup.sh

backend-test:    ## Run backend tests
	shell/backend_test.sh

backend-deploy:  ## Build & deploy backend (STAGE=dev|prod)
	shell/backend_deploy.sh $(STAGE)

backend-remove:  ## Remove backend stack (STAGE=dev|prod)
	shell/backend_remove.sh $(STAGE)

# Frontend convenience
frontend-setup:   ## Install & build frontend
	shell/frontend_setup.sh

frontend-test:    ## Run frontend tests
	shell/frontend_test.sh

frontend-deploy:  ## Build & deploy frontend to S3 (BUCKET=my-bucket)
	shell/frontend_deploy.sh $(BUCKET)

frontend-invalidate: ## Invalidate CloudFront (DIST_ID=XYZ)
	shell/frontend_invalidate.sh $(DIST_ID)
