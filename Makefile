.DEFAULT_GOAL := help
.PHONY: help install install-frontend install-backend install-ai \
        dev dev-frontend dev-backend dev-ai \
        build build-frontend build-backend lint preview \
        clean clean-frontend clean-backend clean-ai \
        docker-up docker-down docker-build docker-logs docker-restart docker-ps \
        deploy deploy-frontend deploy-backend deploy-ai \
        seed health

# ──────────────────────────────────────────────────────────────────────────────
# iDrip — Makefile for development & deployment
# Frontend (Vite/React) :5173 • Backend (Express) :5000 • AI (FastAPI) :8000
# ──────────────────────────────────────────────────────────────────────────────

FRONTEND_DIR := frontend
BACKEND_DIR  := backend
AI_DIR       := ai-service
PYTHON       ?= python
PIP          ?= pip

help: ## Show this help
	@echo "iDrip — available targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ── Install ───────────────────────────────────────────────────────────────────

install: install-frontend install-backend install-ai ## Install all dependencies

install-frontend: ## Install frontend deps
	cd $(FRONTEND_DIR) && npm install

install-backend: ## Install backend deps
	cd $(BACKEND_DIR) && npm install

install-ai: ## Install AI service deps
	cd $(AI_DIR) && $(PIP) install -r requirements.txt

# ── Dev (native, no docker) ───────────────────────────────────────────────────

dev: ## Run all services in docker-compose (recommended)
	docker-compose up

dev-frontend: ## Run frontend dev server (:5173)
	cd $(FRONTEND_DIR) && npm run dev

dev-backend: ## Run backend dev server (:5000)
	cd $(BACKEND_DIR) && npm run dev

dev-ai: ## Run AI service dev server (:8000)
	cd $(AI_DIR) && uvicorn main:app --host 0.0.0.0 --port 8001 --reload

# ── Build & lint ──────────────────────────────────────────────────────────────

build: build-frontend build-backend ## Build frontend + backend for production

build-frontend: ## Build frontend (tsc + vite)
	cd $(FRONTEND_DIR) && npm run build

build-backend: ## Build backend (tsc → dist/)
	cd $(BACKEND_DIR) && npm run build

lint: ## Lint frontend
	cd $(FRONTEND_DIR) && npm run lint

preview: ## Preview frontend production build
	cd $(FRONTEND_DIR) && npm run preview

# ── Docker ────────────────────────────────────────────────────────────────────

docker-up: ## Start all services in background
	docker-compose up -d

docker-down: ## Stop and remove all containers
	docker-compose down

docker-build: ## Rebuild all docker images
	docker-compose build --no-cache

docker-restart: docker-down docker-up ## Restart all services

docker-logs: ## Tail logs from all services
	docker-compose logs -f

docker-ps: ## List running services
	docker-compose ps

# ── Clean ─────────────────────────────────────────────────────────────────────

clean: clean-frontend clean-backend clean-ai ## Remove build artifacts everywhere

clean-frontend:
	cd $(FRONTEND_DIR) && rm -rf dist node_modules/.vite

clean-backend:
	cd $(BACKEND_DIR) && rm -rf dist

clean-ai:
	cd $(AI_DIR) && find . -type d -name __pycache__ -exec rm -rf {} +

# ── Deployment ────────────────────────────────────────────────────────────────
# Production deploys run via GitHub Actions on push to main. These targets
# trigger the workflows manually via `gh` (requires GitHub CLI + auth).

deploy: ## Push to main → triggers all path-filtered deploy workflows
	git push origin main

deploy-frontend: ## Manually trigger frontend deploy workflow
	gh workflow run deploy-frontend.yml

deploy-backend: ## Manually trigger backend deploy workflow
	gh workflow run deploy-backend.yml

deploy-ai: ## Manually trigger AI service deploy workflow
	gh workflow run deploy-ai-service.yml

# ── Utilities ─────────────────────────────────────────────────────────────────

health: ## Hit local health endpoints
	@echo "Frontend  → http://localhost:5173"
	@curl -fsS http://localhost:5000/health  && echo "  ✓ backend"  || echo "  ✗ backend"
	@curl -fsS http://localhost:8000/health  && echo "  ✓ ai"       || echo "  ✗ ai"

seed: ## Re-run backend seed (idempotent — skips if demo user exists)
	cd $(BACKEND_DIR) && npx ts-node src/seed/seed.ts
