# iDrip Frontend

React SPA — virtual wardrobe and outfit UI for iDrip. Mobile-first, glassmorphism design.

**Live:** https://idrip.tech

## Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite 7** — build tool + dev server
- **Tailwind CSS v4** + `tailwindcss-animate`
- **Zustand** — global state
- **React Router** — client-side routing
- **lucide-react** — icons

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
```

Or from repo root:
```bash
docker compose up frontend
```

## Build

```bash
npm run build        # tsc -b && vite build → dist/
npm run preview      # serve dist/ locally
```

## Configuration

- `VITE_API_URL` — base URL for backend API. Defaults to `http://localhost:5000` in dev. In production builds (Cloudflare Pages), set via GitHub secret `VITE_API_URL` and wired into the build step in `.github/workflows/deploy-frontend.yml`.

## Deployment

Pushes to `main` that touch `frontend/**` trigger `.github/workflows/deploy-frontend.yml`:

1. `npm ci` + `npm run build`
2. `wrangler pages deploy dist --project-name=idrip`
3. SPA fallback handled by `public/_redirects`: `/* /index.html 200`

## Project structure

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture breakdown — components, conventions, state stores, type system, theme.
