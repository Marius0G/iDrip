---
title: iDrip AI Service
emoji: 👗
colorFrom: gray
colorTo: black
sdk: docker
app_port: 7860
pinned: false
---

# iDrip AI Service

LangGraph agent for clothing image analysis.

Endpoints:

- `GET /health` — liveness check
- `GET /` — service banner
- `POST /analyze` _(planned)_ — accepts a clothing image, returns structured metadata
