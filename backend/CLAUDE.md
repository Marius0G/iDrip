# Backend Module

<!-- AUTO-MANAGED: module-description -->
## Module Description

Express + TypeScript + Mongoose REST API for iDrip. Serves wardrobe, outfit generation, shopping recommendations, and user profile endpoints. Connects to MongoDB and seeds demo data on startup.
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: architecture -->
## Architecture

```
src/
  index.ts          # Entry point — Express app, route mounting, connectDB + seed on startup
  config/
    db.ts           # connectDB() — Mongoose connection via MONGO_URI env var
  models/
    User.ts         # IUser: name, email (unique), preferences (styles, colors, budget, sizes)
    WardrobeItem.ts # IWardrobeItem: userId, name, category, color, brand, imageUrl, seasons, tags
    Outfit.ts       # IOutfit: userId, name, items[], occasion, score, aiReasoning, savedByUser
  routes/
    wardrobe.ts     # GET / (filter category/season), GET /:id, POST /, PUT /:id, DELETE /:id
    outfits.ts      # POST /generate, GET /, GET /:id, PATCH /:id/save, DELETE /:id
    recommendations.ts  # GET / (filter budget/style, sorted by matchScore)
    users.ts        # GET /me, PUT /me/preferences
  seed/
    data.ts         # DEMO_USER, SEED_WARDROBE_ITEMS (12 items), MOCK_RECOMMENDATIONS (8), REASONING_TEMPLATES (5)
    seed.ts         # Idempotent seeder — skips if demo user already exists
```
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: conventions -->
## Conventions

- Module type: `commonjs` — use `require`/`module.exports` is transpiled from TS imports
- All routes scope to demo user `alex@idrip.demo` via `getDemoUserId()` — no auth layer
- `MONGO_URI` env var for DB connection; defaults to `mongodb://localhost:27017/idrip`
- `PORT` env var for server port; defaults to `5000`
- Routes do not use try/catch — errors propagate to Express default handler (Express 5 async support)
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: backlog-status -->
## Backlog Status

**Implemented (Done):** All Epic 6 API endpoints complete — wardrobe CRUD, outfit generation + save/delete, recommendations with budget/style filtering, user profile + preferences, DB seeding (idempotent, 12 wardrobe items + 2 outfits + 8 mock recommendations).

**Pending (To Do):**
- US-3.4 Purchase Tracking — no backend endpoint yet; will need `POST /api/wardrobe` from recommendation data + budget deduction logic

**Future Epics (not started):**
- Epic 7: Authentication — `POST /api/auth/register`, `POST /api/auth/login`, JWT middleware, per-user scoping (currently hardcoded to demo user `alex@idrip.demo`)
- Epic 8: AI Integration:
  - US-8.2.1 `POST /api/ai/analyze-clothing` (5pts) — accepts `{ image: string }` base64 data URL, proxies to Python ai-service at `http://ai-service:8000/analyze`, 10s timeout, returns 503 if unavailable, rate-limited 10 req/min
  - US-8.2.2 Python ai-service (13pts) — Dockerized FastAPI service; LangGraph agent flow: Image Preprocessor → Vision Analyzer → Output Parser → Confidence Scorer; env vars: LLM_MODEL, LLM_API_KEY, LLM_BASE_URL; health check: `GET /health`
  - US-8.1 Real AI outfit gen (13pts) — replace random category picker with LLM
  - US-8.3 Real shopping recs (13pts) — live product data integration
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: dependencies -->
## Key Dependencies

- **Express** — HTTP server and router
- **Mongoose** — MongoDB ODM with schema validation
- **cors** — CORS middleware (open, no restrictions)
- **dotenv** — env var loading
- **ts-node** — TypeScript execution for dev

### API Endpoints
- `GET /health` — liveness check
- `GET|POST|PUT|DELETE /api/wardrobe` — wardrobe items CRUD
- `GET|POST /api/outfits`, `POST /api/outfits/generate`, `PATCH /api/outfits/:id/save` — outfit management
- `GET /api/recommendations` — shopping suggestions (mock data, filterable)
- `GET /api/users/me`, `PUT /api/users/me/preferences` — demo user profile
- `POST /api/ai/analyze-clothing` _(planned)_ — proxies image to Python ai-service; returns clothing metadata JSON

### Data Model Notes
- `WardrobeItem.category`: tops | bottoms | shoes | outerwear | accessories
- `WardrobeItem.seasons`: spring | summer | fall | winter | all
- `Outfit.items`: array of ObjectId refs to WardrobeItem (populated on read)
- `Outfit.score`: integer 0–100 (seeded/generated as 75–99)
<!-- END AUTO-MANAGED -->
