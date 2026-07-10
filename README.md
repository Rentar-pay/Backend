# Rentar — Rent Savings on Stellar

> Never miss rent again. Save smarter on Stellar.

Rentar is a production-ready rent-savings dApp built on **Stellar Soroban**. Users create rent vault goals, auto-save XLM/USDC, earn DeFi yield, and pay landlords directly on-chain — all while preserving self-custody. Frontend talks **only** to Rentar Backend REST API; blockchain interaction limited to wallet signing (SEP-10).

## Features Implemented

- **Landing Page**: Hero, Features, How-it-Works, Security, Testimonials, Footer
- **Authentication**: SEP-10 Challenge/Response via Freighter & WalletConnect
- **Dashboard**: Overview cards, savings chart, upcoming rent, notifications
- **Savings Overview**: Spending categories (PieChart), Yield (BarChart), Growth (AreaChart)
- **Savings Goal Creation**: Form with target, rent, deadline, landlord link → Soroban vault via API
- **Deposit Flow**: Select goal, amount, sign via Freighter, txHash tracking
- **Withdrawal Flow**: Withdraw with warning, vault unlock via API
- **Rent Payment Flow**: Direct on-chain payment to landlord, optional goal source
- **Landlord Management**: CRUD landlords, wallet verification, auto-pay toggle
- **Transaction History**: Tabs filtering, Stellar Expert links, status badges
- **Notifications**: Rent reminders, milestones, yield alerts, mark-read
- **Analytics**: 3 tabs - Overview, Rent History, Yield trends (Recharts)
- **Profile**: Display name, email, public key, KYC badge
- **Settings**: Appearance (next-themes), notifications toggle, API/Contract display
- **Wallet Connection**: Freighter detection, WalletConnect mock, copy address, explorer link
- **Admin Dashboard**: Stats, user list, system info

### Wallet Integrations

- **Freighter**: `window.freighterApi` detection, `getPublicKey()`, `signMessage()` with network passphrase
- **WalletConnect**: Mock service simulating WC Sign Client (production uses `@walletconnect/sign-client`)
- **SEP-10**: `GET /auth/challenge` → client signs locally → `POST /auth/verify` → JWT

### Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 + shadcn/ui (custom components)
- React Query for API state, Sonner for toasts
- `@stellar/stellar-sdk` for address validation, network config
- `@stellar/freighter-api` for wallet interaction
- Recharts for charts, next-themes for dark mode, lucide-react icons
- Framer Motion ready, date-fns for dates

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=/api  # Rentar Backend REST API
NEXT_PUBLIC_NETWORK=testnet # stellar network
NEXT_PUBLIC_CONTRACT_ID=C... # Soroban rent vault contract
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
DATABASE_URL=postgresql://... # Only for local mock DB if used
```

Frontend **never** calls Horizon/Soroban directly except via wallet signing.

### API Service Layer

`src/lib/api/client.ts`:
- Central `ApiClient` class with `getAuthToken()` from localStorage, Bearer injection, query builder
- Exports typed interfaces: `SavingsGoal`, `Transaction`, `Landlord`, `SavingsOverview`, etc.
- Config from env vars

`src/lib/api/services.ts`: Domain services (auth, savings, rent, landlords, transactions, notifications, analytics, user, admin) wrapping client.

`src/hooks/use-savings.ts`: React Query hooks for all domains with cache invalidation on mutations.

### Project Structure

```
src/
  app/
    page.tsx (landing)
    auth/page.tsx (wallet login)
    dashboard/
      layout.tsx (sidebar, mobile nav, auth guard)
      page.tsx (main dashboard)
      savings/page.tsx
      goals/page.tsx
      deposit/page.tsx
      withdraw/page.tsx
      rent/page.tsx
      landlords/page.tsx
      history/page.tsx
      notifications/page.tsx
      analytics/page.tsx
      profile/page.tsx
      settings/page.tsx
      wallet/page.tsx
    admin/page.tsx
    api/ (mock Rentar Backend)
      auth/challenge, verify, me
      savings/overview, goals, deposit, withdraw
      rent/pay, upcoming
      landlords, transactions, notifications, analytics
  components/
    ui/ (shadcn)
    layout/ (header, sidebar, mobile-nav)
    landing/ (hero, features, how-it-works)
    dashboard/ (overview-cards, savings-chart, goals-list)
    shared/ (skeletons)
    providers.tsx (QueryClient + Theme + Auth + Wallet + Toaster)
  contexts/
    auth-context.tsx (SEP-10 login, localStorage JWT, mock fallback)
    wallet-context.tsx (Freighter + WC, signMessage abstraction)
  lib/
    api/client.ts, services.ts
    wallet/freighter.ts, walletconnect.ts, stellar.ts
    mock-data.ts
    utils.ts
```

### Responsive & Accessibility

- Mobile nav bottom bar, sidebar hidden <lg
- All interactive elements have aria-labels, focus rings via Tailwind ring
- Color contrast meets WCAG AA, `prefers-reduced-motion` respected (charts animated only via CSS)
- Dark mode via `next-themes` class strategy, custom CSS variables
- Keyboard navigable, semantic HTML

### Loading, Empty, Error States

- `DashboardSkeleton`, `TableSkeleton` pulsating placeholders
- `EmptyState` component with icon, title, desc, action button
- `ErrorState` with retry
- React Query `isLoading` everywhere, toast on mutation error

### Testing

- Component tests: `src/components/__tests__/button.test.tsx` (Vitest + Testing Library)
- Playwright e2e: `tests/e2e/rentar.spec.ts` covers landing, auth, dashboard flows

### Storybook

`.storybook/main.ts` and stories in `src/components/ui/*.stories.tsx` (Button, Card)

### Running Locally

```bash
npm install
cp .env.local.example .env.local # set vars
npm run dev # http://localhost:3000
```

### Deployment Guide

See `DEPLOYMENT.md`.

### GitHub Actions

`.github/workflows/ci.yml` runs lint, typecheck, build, tests on push.

### License

MIT — Rentar Labs 2026
