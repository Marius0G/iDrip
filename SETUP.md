# iDrip Deployment Setup

End-to-end setup for the production stack:

| Piece        | Where                                    | Notes                                       |
| ------------ | ---------------------------------------- | ------------------------------------------- |
| Frontend     | Cloudflare Pages                         | Already wired in `deploy-frontend.yml`      |
| Backend      | Heroku (Eco dyno)                        | `backend/` — auto-deploys on push           |
| AI service   | Hugging Face Spaces (Docker SDK)         | `ai-service/` — auto-deploys on push        |
| Database     | MongoDB Atlas (M0 free tier)             | 512 MB, free forever                        |
| Domain       | `idrip.tech` (via GitHub Student Pack)   | DNS managed by Cloudflare                   |
| HTTPS        | Cloudflare (frontend) + Heroku (backend) + HF (ai) | Free                              |

```
                ┌────────── Cloudflare DNS (free) ──────────┐
                │                                            │
   idrip.tech   ──→  Cloudflare Pages (frontend, proxied ☁️) │
   api.idrip.tech ─→  Heroku backend (DNS only)              │
   ai.idrip.tech  ─→  HF Space ai-service (DNS only)         │
                └────────────────────────────────────────────┘
                                    │
                                    └─→ MongoDB Atlas (free M0)
```

---

## ⚠️ Security note

`.env` at the repo root contains a Cloudflare API token. It is gitignored, but if it was ever committed or shared, **rotate it now** at Cloudflare dashboard → My Profile → API Tokens.

---

## 1. MongoDB Atlas (free 512 MB)

1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free **M0 cluster** (region: closest to Heroku — pick `EU (Ireland)` if Heroku app region is `eu`).
3. **Database Access** → add a user (e.g. `idrip`) with a strong password. Save it.
4. **Network Access** → add IP `0.0.0.0/0` (Heroku and HF dynos have dynamic IPs).
5. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://idrip:<password>@cluster0.xxxxx.mongodb.net/idrip?retryWrites=true&w=majority
   ```
   Replace `<password>` with the user's password and append `/idrip` as the database name.

This is your `MONGO_URI`. Save it for step 5.

---

## 2. Domain — `idrip.tech` already purchased ✅

You already own `idrip.tech` via the Student Pack / Get.tech offer.

In the next step we'll point its DNS at Cloudflare's nameservers.

---

## 3. Cloudflare (DNS + free SSL on frontend)

1. Sign up: https://cloudflare.com (free plan).
2. **Add a site** → enter `idrip.tech` → select Free plan.
3. Cloudflare gives you 2 nameservers (e.g. `ada.ns.cloudflare.com`, `kirk.ns.cloudflare.com`).
4. Go to Get.tech (where you registered the domain) → change the nameservers to Cloudflare's. Propagation: minutes to hours.
5. In Cloudflare → SSL/TLS → set encryption mode to **Full**.

DNS records get added in step 6 once we know the Heroku/HF targets.

---

## 4. Hugging Face (ai-service)

1. Sign up: https://huggingface.co/join
2. Create a new Space:
   - **Owner:** your username
   - **Space name:** `idrip-ai`
   - **License:** MIT (or whatever)
   - **SDK:** **Docker** (important — not Gradio)
   - **Visibility:** Public (or Private — both work on free tier)
3. After creation, you don't need to push anything manually — the GitHub Action will do it on the next push to `main`.
4. Generate a write token: Profile → Settings → Access Tokens → New token → role **Write**. Save it. (Used as `HF_TOKEN` secret below.)

The Space will be reachable at `https://<your-username>-idrip-ai.hf.space`.

---

## 5. Heroku (after student credits land)

```bash
# Login
heroku login

# Verify student status (gives ~$13/mo credit for 24 months)
# https://www.heroku.com/github-students/signup

# Create the backend app (region: eu since you're in Romania)
heroku create idrip-backend --region eu

# Set env vars on backend
heroku config:set -a idrip-backend \
  MONGO_URI="mongodb+srv://idrip:PASSWORD@cluster0.xxxxx.mongodb.net/idrip" \
  FRONTEND_URL="https://idrip.tech" \
  AI_SERVICE_URL="https://<your-hf-username>-idrip-ai.hf.space" \
  NODE_ENV="production"

# Add custom domain to backend
heroku domains:add api.idrip.tech -a idrip-backend
# Heroku prints the DNS target — that's the value for the api.idrip.tech CNAME.
```

---

## 6. Cloudflare DNS records

Once you have the Heroku and HF targets, add these in Cloudflare → DNS:

| Type  | Name | Target                                       | Proxy            |
| ----- | ---- | -------------------------------------------- | ---------------- |
| CNAME | @    | `idrip.pages.dev` (your Pages project)       | ✅ Proxied        |
| CNAME | www  | `idrip.pages.dev`                            | ✅ Proxied        |
| CNAME | api  | (whatever `heroku domains` printed)          | ❌ DNS only       |
| CNAME | ai   | `<your-hf-username>-idrip-ai.hf.space`       | ❌ Proxied off    |

Then, in the Cloudflare Pages project → Custom domains → add `idrip.tech` and `www.idrip.tech` (this binds the Pages site to the domain).

---

## 7. GitHub Secrets (for auto-deploy workflows)

Repo → Settings → Secrets and variables → Actions → **New repository secret**:

| Secret name                | Value                                             |
| -------------------------- | ------------------------------------------------- |
| `HEROKU_API_KEY`           | output of `heroku auth:token`                     |
| `HEROKU_EMAIL`             | your Heroku account email                         |
| `HEROKU_BACKEND_APP`       | `idrip-backend`                                   |
| `HF_TOKEN`                 | the write token from HF (step 4)                  |
| `HF_USERNAME`              | your HF username                                  |
| `HF_SPACE`                 | `idrip-ai`                                        |
| `CLOUDFLARE_API_TOKEN`     | already in use by `deploy-frontend.yml`           |
| `CLOUDFLARE_ACCOUNT_ID`    | already in use by `deploy-frontend.yml`           |

Optional — for the frontend to know the API URL at build time:

| Secret name      | Value                       |
| ---------------- | --------------------------- |
| `VITE_API_URL`   | `https://api.idrip.tech`    |

If you add `VITE_API_URL`, also update `.github/workflows/deploy-frontend.yml`:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

---

## 8. First deploy

Once all secrets are set, push to `main` — all three workflows fire (path-filtered):

```bash
git add .
git commit -m "wire up production deployment"
git push origin main
```

Or trigger manually: GitHub → Actions → pick the workflow → "Run workflow."

---

## 9. Post-deploy checks

```bash
curl https://api.idrip.tech/health
# → {"status":"ok","message":"iDrip Backend is running"}

curl https://ai.idrip.tech/health
# → {"status":"ok","service":"ai-service"}

open https://idrip.tech
```

---

## Local development

Still works exactly as before:

```bash
docker compose up
```

The `docker-compose.yml` runs everything against a local Mongo container, with the AI service on port 8000 (production uses 7460 internally on HF). Production uses Atlas via `MONGO_URI`. No changes to local dev.

---

## Files added/changed for deployment

**Backend (Heroku):**
- `backend/Procfile` — Heroku web dyno entry
- `backend/package.json` — added `heroku-postbuild` script + `engines.node`
- `backend/src/index.ts` — CORS now restricted to `FRONTEND_URL` in prod

**AI service (Hugging Face Spaces):**
- `ai-service/main.py` — replaced stub with FastAPI app exposing `/health`
- `ai-service/requirements.txt` — added `fastapi` + `uvicorn`
- `ai-service/Dockerfile` — listens on `$PORT` (defaults to 7860 for HF)
- `ai-service/README.md` — HF Space frontmatter (`sdk: docker`, `app_port: 7860`)

**CI/CD:**
- `.github/workflows/deploy-backend.yml` — auto-deploys backend to Heroku on push
- `.github/workflows/deploy-ai-service.yml` — auto-pushes ai-service to HF Space on push
- `docker-compose.yml` — sets `PORT=8000` for ai-service so local dev still uses 8000

**Docs:**
- `SETUP.md` — this file
