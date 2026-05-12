---
title: iDrip AI Service
emoji: 👗
colorFrom: gray
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

# iDrip AI Service

FastAPI service that hosts the iDrip vision agent. Backed by LangChain / LangGraph for the clothing analysis pipeline (planned, see US-8.2.2).

**Live:** https://bogdan-ca-idrip-ai.hf.space

## Endpoints

| Method | Path        | Description                                   |
| ------ | ----------- | --------------------------------------------- |
| GET    | `/health`   | Liveness check (`{"status":"ok"}`)            |
| GET    | `/`         | Service banner                                |
| GET    | `/docs`     | Swagger UI (FastAPI auto-generated)           |
| POST   | `/analyze`  | _Planned_ — accepts an image, returns structured clothing metadata via the LangGraph agent (Image Preprocessor → Vision Analyzer → Output Parser → Confidence Scorer) |

## Running locally

```bash
pip install -r requirements.txt
python main.py            # http://localhost:8000
```

Or from repo root:
```bash
docker compose up ai-service
```

The Dockerfile listens on `$PORT` (defaults to `7860` for Hugging Face Spaces; `docker-compose.yml` sets `PORT=8000` for local dev).

## Environment variables

| Name           | Required | Notes                                              |
| -------------- | -------- | -------------------------------------------------- |
| `PORT`         | no       | Default `7860` in prod, `8000` in docker-compose   |
| `LLM_MODEL`    | _planned_| Model identifier for the vision LLM (US-8.2.2)     |
| `LLM_API_KEY`  | _planned_| Provider API key (OpenAI, Anthropic, etc.)         |
| `LLM_BASE_URL` | _planned_| Custom base URL for self-hosted LLMs               |

## Deployment

Pushes to `main` that touch `ai-service/**` trigger `.github/workflows/deploy-ai-service.yml`:

1. Copy `ai-service/` to a clean working dir
2. `git init` + commit
3. Force-push to `huggingface.co/spaces/Bogdan-ca/idrip-ai`
4. Hugging Face rebuilds the Docker Space and restarts it

## Architecture

Currently a minimal FastAPI app. The full agent pipeline (vision LLM + structured output + confidence scoring) is tracked in `BACKLOG.md` under Epic 8 (US-8.2.2).
