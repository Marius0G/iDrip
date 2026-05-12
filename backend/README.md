# iDrip Backend

Express + TypeScript + Mongoose REST API for iDrip. Serves wardrobe, outfit generation, shopping recommendations, and user profile endpoints.

**Live:** https://api.idrip.tech

## Stack

- **Express 5** + **TypeScript** (commonjs, strict mode)
- **Mongoose** — MongoDB ODM
- **cors**, **dotenv**
- **ts-node** in dev, compiled `dist/` in prod

## Running locally

```bash
npm install
npm run dev          # ts-node src/index.ts on http://localhost:5000
```

Or from repo root:
```bash
docker compose up backend mongo
```

Requires a local MongoDB on `mongodb://localhost:27017/idrip`, or set `MONGO_URI` to an Atlas connection string.

## Environment variables

| Name           | Required | Default                              | Notes                                                |
| -------------- | -------- | ------------------------------------ | ---------------------------------------------------- |
| `MONGO_URI`    | yes      | `mongodb://localhost:27017/idrip`    | Atlas connection string in prod                      |
| `PORT`         | no       | `5000`                               | Heroku sets this automatically                       |
| `FRONTEND_URL` | no       | _open CORS_                          | When set, restricts CORS to this origin (e.g. `https://idrip.tech`) |
| `NODE_ENV`     | no       | _unset_                              | `production` on Heroku                               |
| `AI_SERVICE_URL` | no     | _unset_                              | `https://bogdan-ca-idrip-ai.hf.space` in prod. Used by the planned `/api/ai/analyze-clothing` proxy (US-8.2.1). |

## API endpoints

| Method | Path                            | Description                                  |
| ------ | ------------------------------- | -------------------------------------------- |
| GET    | `/health`                       | Liveness check                               |
| GET    | `/api/wardrobe`                 | List wardrobe items (filter `category`, `season`) |
| GET    | `/api/wardrobe/:id`             | One item                                     |
| POST   | `/api/wardrobe`                 | Create item                                  |
| PUT    | `/api/wardrobe/:id`             | Update item                                  |
| DELETE | `/api/wardrobe/:id`             | Delete item                                  |
| POST   | `/api/outfits/generate`         | Generate an outfit                           |
| GET    | `/api/outfits`                  | List saved outfits                           |
| PATCH  | `/api/outfits/:id/save`         | Toggle save flag                             |
| GET    | `/api/recommendations`          | Shopping suggestions (filter `budget`, `style`) |
| GET    | `/api/users/me`                 | Demo user profile                            |
| PUT    | `/api/users/me/preferences`     | Update preferences                           |

All routes scope to the demo user `alex@idrip.demo` (no auth layer yet — see Epic 7 in `BACKLOG.md`).

## Build

```bash
npm run build        # tsc → dist/
npm start            # node dist/index.js (prod entry)
```

On Heroku, `heroku-postbuild` runs `npm run build`, then the `Procfile` runs `npm start`.

## Deployment

Pushes to `main` that touch `backend/**` trigger `.github/workflows/deploy-backend.yml`:

1. Install Heroku CLI on runner
2. `akhileshns/heroku-deploy` pushes to `idrip-backend` app on Heroku
3. Heroku builds the slug (npm install + heroku-postbuild) and releases

Heroku app: `idrip-backend` (region `eu`), custom domain `api.idrip.tech` with Let's Encrypt cert via ACM.

## Project structure

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture breakdown — models, routes, seed data, conventions.
