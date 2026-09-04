# RiceShare Frontend

Next.js (App Router) frontend for **RiceShare** — a surplus-food marketplace for Sri Lanka. Providers list surplus food for discounted sale or free donation; customers browse and contact providers directly by phone, no account needed.

Talks to the [RiceShare backend](https://github.com/ravindudanthanarayana/SEF-Backend) over REST via `NEXT_PUBLIC_API_URL`.

## Tech stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Custom JWT auth (provider/admin login only — customers don't need accounts)

## Local setup

```bash
npm install
cp .env.example .env   # point NEXT_PUBLIC_API_URL at your local/deployed backend
npm run dev             # http://localhost:3000
```

Run the [backend](https://github.com/ravindudanthanarayana/SEF-Backend) locally first (defaults to `http://localhost:4000`).

## Environment variables

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the RiceShare backend API (Railway in production) |

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
```

## Deploying to Vercel

1. Import this repo into Vercel.
2. Set `NEXT_PUBLIC_API_URL` to your deployed Railway backend URL.
3. Deploy — Vercel runs `npm run build` / `next start` automatically.
4. On the backend, set `FRONTEND_URL` to this Vercel deployment's URL so CORS allows it.

## Routes

- `/`, `/browse`, `/food/[id]` — public, no login
- `/provider/login`, `/provider/register` — provider portal
- `/provider/*` — provider dashboard (listings, impact, profile)
- `/admin/login`, `/admin/*` — admin dashboard (users, providers, listings, reports)
