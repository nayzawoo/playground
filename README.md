# Tools PWA

An offline-first PWA built with React, Vite, and Zustand. Notes sync to Upstash Redis via a Vercel serverless API.

## Local Development

```bash
pnpm install
pnpm dev
```

The dev server proxies `/api` requests to `http://localhost:3000`. To test the API locally, use `vercel dev` instead of `pnpm dev`.

## Deploy to Vercel

### 1. Push to GitHub

Push this repo to a GitHub repository.

### 2. Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
2. Vercel auto-detects **Vite** — no build settings need to change.
   - **Build Command:** `tsc -b && vite build`
   - **Output Directory:** `build`

### 3. Create an Upstash Redis Database

1. Go to [console.upstash.com](https://console.upstash.com).
2. Create a new **Redis** database.
3. Copy the **REST URL** and **REST Token** from the database details page.

### 4. Set Environment Variables

In your Vercel project, go to **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Your Upstash REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash REST token |
| `EDIT_PASSWORD` | A secret password for syncing notes |

### 5. Redeploy

Trigger a redeploy from the Vercel dashboard (or push a new commit) so the env vars take effect.

## API

The serverless function lives at `api/notes.js`.

| Method | Auth | Description |
|---|---|---|
| `GET /api/notes` | None | Fetch notes from Redis |
| `POST /api/notes` | `X-Edit-Password` header | Save notes to Redis |

## PWA

The app registers a service worker (via `vite-plugin-pwa`) that caches the shell for instant offline loading. On iOS, add to Home Screen for a native-like standalone experience.
