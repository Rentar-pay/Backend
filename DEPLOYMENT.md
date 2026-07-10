# Deployment Guide — Rentar

## Overview

Rentar frontend is Next.js static + SSR capable, talks only to Rentar Backend REST API. Needs env vars at build time for `NEXT_PUBLIC_*`.

## Environment Variables (required)

| Var | Example | Description |
|-----|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api.rentar.io` or `/api` for local mock | Rentar Backend |
| `NEXT_PUBLIC_NETWORK` | `testnet` / `mainnet` | Stellar network |
| `NEXT_PUBLIC_CONTRACT_ID` | `CABC...` | Soroban Rent Vault contract |
| `DATABASE_URL` | `postgresql://...` | Only if using local mock API with DB |

Optional:

- `NEXT_PUBLIC_HORIZON_URL` for explorer links.

Set in Vercel / Netlify dashboard or `.env.local`.

## Build Steps

```bash
npm ci
npx next typegen
npm run build
npm start # or serve .next via Vercel
```

Build output: `.next/`.

## Vercel (Recommended)

1. Connect GitHub repo.
2. Framework preset: Next.js.
3. Env vars: Add 3 `NEXT_PUBLIC_*` vars.
4. Deploy — Vercel runs `next build` automatically.
5. Add custom domain `rentar.io`, enable auto HTTPS.

Vercel handles edge caching for `/api` mock routes; if using external API, set `NEXT_PUBLIC_API_URL` to external URL (CORS must allow frontend origin).

## Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_NETWORK
ARG NEXT_PUBLIC_CONTRACT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_NETWORK=$NEXT_PUBLIC_NETWORK
ENV NEXT_PUBLIC_CONTRACT_ID=$NEXT_PUBLIC_CONTRACT_ID
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

Build:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.rentar.io --build-arg NEXT_PUBLIC_NETWORK=testnet --build-arg NEXT_PUBLIC_CONTRACT_ID=C... -t rentar .
docker run -p 3000:3000 rentar
```

## Self-hosted / VPS

- Use PM2: `pm2 start npm --name rentar -- start`
- Nginx reverse proxy to 3000, TLS via Certbot.
- Ensure `/api/health` returns 200 for load balancer health checks.

## Stellar Specifics

- Frontend does **not** need Stellar RPC credentials; wallets sign locally.
- Sørdf: Configure backend to use same `CONTRACT_ID` and network passphrase (`Public Global...` or `Test SDF Network...`).
- SEP-10: Backend must implement `/auth/challenge` returning XDR challenge and `/auth/verify` validating signed XDR.
- Freighter: Users need extension installed. No server config needed.

## QA Checklist Before Prod

- [ ] `NEXT_PUBLIC_API_URL` reachable, CORS ok
- [ ] `/api/health` returns 200
- [ ] Sep-10 flow works with Freighter on testnet
- [ ] Dark mode persists
- [ ] Mobile nav works (iOS Safari, Android Chrome)
- [ ] Lighthouse >90 performance, a11y
- [ ] Charts responsive
- [ ] Toast notifications appear
- [ ] Empty / error / loading states visible
- [ ] Playwright e2e passes

## Rollback

- Vercel: instant rollback to previous deployment via dashboard.
- Docker: tag previous image `:prev` and redeploy.

## Monitoring

- Sentry for errors (add `SENTRY_DSN` if needed)
- Vercel Analytics / Google Analytics optional
- Uptime check on `/api/health`

## Production Secrets

Never expose private keys. Only public env vars used. JWT stored in localStorage; consider httpOnly cookie for production hardening.

---

Maintained by Rentar DevOps • 2026
