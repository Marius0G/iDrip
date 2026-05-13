# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

iDrip is an AI-powered personal stylist app. Users digitize their wardrobe by taking photos of clothes, the AI combines them into outfits, and suggests new purchases that complement what they already own.

**Live:** Frontend on [Cloudflare Pages](https://idrip.tech), Backend on [Heroku](https://api.idrip.tech), AI Service on [Hugging Face Spaces](https://bogdan-ca-idrip-ai.hf.space), DB on MongoDB Atlas M0.

### Core Features

- **Wardrobe digitization:** Take/upload photos of your clothes to build a digital wardrobe
- **AI outfit generation:** Two interaction modes — a chatbot interface for conversational styling and quick style buttons for one-tap outfit ideas
- **Smart shopping recommendations:** AI suggests new clothing items to buy based on what you already own, ensuring purchases work well with your existing wardrobe
- **Preferences & style tab:** Configure personal style preferences, budgets, and taste profiles that guide both outfit generation and purchase recommendations

## Commands

### Frontend (`frontend/`)
```bash
npm run dev      # Vite dev server (port 5173)
npm run build    # tsc -b + vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Backend (`backend/`)
```bash
npm run build       # tsc → dist/
npx ts-node src/index.ts   # Dev run (port 5000)
npm start           # node dist/index.js (production)
```

### AI Service (`ai-service/`)
```bash
uvicorn main:app --host 0.0.0.0 --port 8000   # FastAPI dev server
```

### Docker
```bash
docker-compose up   # All 4 services (frontend :5173, backend :5000, ai-service :8000, mongo :27017)
```

## Architecture

```
├── frontend/          React 19 SPA (Vite + TypeScript + Tailwind v4)
├── backend/           Express 5 REST API (TypeScript + Mongoose)
├── ai-service/        Python FastAPI stub (LangChain + LangGraph planned)
├── docker-compose.yml  Local dev orchestration
├── BACKLOG.md          Product backlog with user stories (21/33 done)
└── SETUP.md            Setup instructions and env var reference
```

## Frontend Architecture

### Routing (`frontend/src/app/router.tsx`)
6 routes under a shared `RootLayout` (Sidebar + Header + MobileNav + Outlet):

| Route | Page | Purpose |
|---|---|---|
| `/` | `DashboardPage` | Stats, outfit carousel, quick actions, upload |
| `/wardrobe` | `WardrobePage` | Grid with search, category filter, upload, detail sheet |
| `/generator` | `OutfitGeneratorPage` | Builder tab (5 slots + generate) + Saved tab |
| `/shopping` | `ShoppingPage` | Budget slider, style tags, recommendation cards |
| `/profile` | `ProfilePage` | User info, style prefs, budget, theme, clear data |
| `*` | `NotFoundPage` | 404 glass card |

### State Management (Zustand, all persisted to localStorage)
- `useWardrobeStore` — clothing items, CRUD, filters, search
- `useOutfitStore` — outfits, current 5-slot build, generate/save/delete/rate
- `useShoppingStore` — recommendations, budget, style filters, dismiss
- `useUserStore` — user profile, style prefs, theme, clearAllData

### Services (`frontend/src/services/`)
**Currently all stubs with simulated delays.** `wardrobeService.ts`, `outfitService.ts`, `shoppingService.ts` — none call the actual backend API yet. Mock data lives in `frontend/src/data/`.

### Component Organization
- `components/glass/` — `GlassCard` (CVA variants: default/lg/sm/hover), `GlassPanel`
- `components/layout/` — `Sidebar`, `Header`, `MobileNav`, `PageContainer`
- `components/shared/` — `EmptyState`, `SearchInput`, `ImageUploader`, `TagBadge`
- `components/wardrobe/` — `ClothingCard`, `ClothingGrid`, `ClothingDetailSheet`, `ClothingUploadDialog`, `CategoryFilter`
- `components/outfit/` — `OutfitBuilder` (5 slots: Top/Bottom/Shoes/Outerwear/Accessory), `OutfitSlot`, `OutfitCard`, `OutfitGrid`, `GenerateButton`
- `components/shopping/` — `BudgetSlider`, `RecommendationCard`, `StyleTagSelector`
- `components/dashboard/` — `StatCard`, `RecentOutfitCarousel`, `QuickActions`
- `hooks/` — `useDebounce`, `useImageUpload` (resize + base64), `useMediaQuery`, `useTheme`

## Backend Architecture

### Models (`backend/src/models/`)
- **User** — name, email, preferences (styles, colors, budget, sizes)
- **WardrobeItem** — userId, name, category (tops/bottoms/shoes/outerwear/accessories), color, brand, imageUrl, seasons, tags
- **Outfit** — userId, name, items (ObjectId[]), occasion, score, aiReasoning, savedByUser

### API Routes (`backend/src/routes/`)
- `users.ts` — `GET /api/users/me`, `PUT /api/users/me/preferences`
- `wardrobe.ts` — CRUD at `/api/wardrobe` (list with `?category=&season=` filters)
- `outfits.ts` — `POST /api/outfits/generate`, list, get, save toggle, delete
- `recommendations.ts` — `GET /api/recommendations?budget=&style=`

On startup, `seed/seed.ts` runs idempotently (skips if demo user already exists), creating a demo user, 12 wardrobe items, and 2 outfits.

## AI Service (`ai-service/`)

Currently a **stub**. The FastAPI app has only `/health` and `/` endpoints. `requirements.txt` has `langchain` and `langgraph` for future AI agent work. According to BACKLOG.md, planned capabilities include real outfit generation, clothing recognition from photos (vision LLM), and online shopping recommendations — all tracked as US-8.x stories.

## Design System

"Glassy Apple-like" minimalist design:
- **Colors:** Monochrome black & white; gray only for borders/disabled states
- **Glassmorphism:** `backdrop-blur-xl`, semi-transparent backgrounds (`bg-white/70`, `bg-black/5`), subtle borders
- **Shapes:** `rounded-2xl` or `rounded-3xl` for cards, modals, buttons
- **Typography:** Inter, ui-sans-serif stack
- **Responsive:** Mobile-first with bottom tab bar on mobile, sidebar on desktop

CSS variables (shadcn/ui pattern) in `frontend/src/index.css` for theming. Dark mode via `.dark` class on `<html>`. Custom utility classes: `.glass`, `.glass-card`, `.glass-card-lg`, `.glass-nav`. The `cn()` helper in `frontend/src/lib/utils.ts` merges Tailwind classes with `clsx` + `tailwind-merge`.

## CI/CD

Three path-filtered GitHub Actions workflows, all on push to `main`:
- `deploy-frontend.yml` — builds Vite app, publishes to Cloudflare Pages via wrangler
- `deploy-backend.yml` — deploys `backend/` subtree to Heroku
- `deploy-ai-service.yml` — force-pushes `ai-service/` subtree to Hugging Face Space

Secrets needed: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `HEROKU_API_KEY`, `HEROKU_EMAIL`, `HEROKU_BACKEND_APP`, `HF_TOKEN`, `HF_USERNAME`, `HF_SPACE`.

## Key Conventions

- TypeScript strict mode across frontend and backend. No `any` types.
- React functional components + hooks, keep components under ~200 lines
- Zustand for state (not Context), stores persisted to localStorage under `idrip-*` keys
- Tailwind utility classes only — no inline CSS
- Frontend services are all stubs; real API calls need to be wired up
- Backend seeds on startup; seeding is idempotent
- The `.agents/rules/idrip-app-guide.md` file contains the full agent persona and development rules
