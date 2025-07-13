SHELL := bash
.DEFAULT_GOAL := help

# override on CLI:
STAGE      ?= dev
BUCKET     ?= your-s3-bucket
DIST_ID    ?= your-cloudfront-id

.PHONY: help build test lint backend-deploy backend-remove frontend-deploy frontend-invalidate

help:            ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build:           ## Build both backend & frontend
	cd backend && npm ci && npm run build
	cd frontend && npm ci && npm run build

test:            ## Run backend + frontend tests
	cd backend  && npm test
	cd frontend && npm run test:frontend

lint:            ## Run linters (frontend)
	cd frontend && npm run lint

backend-deploy:  ## Build & deploy backend (STAGE=dev|prod)
	shell/backend_deploy.sh $(STAGE)

backend-remove:  ## Remove backend stack (STAGE=dev|prod)
	shell/backend_remove.sh $(STAGE)

frontend-deploy: ## Build & deploy frontend to S3 (BUCKET=my-bucket)
	shell/frontend_deploy.sh $(BUCKET)

frontend-invalidate: ## Invalidate CloudFront (DIST_ID=XYZ)
	shell/frontend_invalidate.sh $(DIST_ID)
