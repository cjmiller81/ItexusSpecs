# REPO_NOTES — ItexusSpecs

## 1. PURPOSE
ItexusSpecs (internal name `echo-ui`) is a Yarn/Lerna monorepo containing multiple customer-branded trading-platform web frontends plus a shared React component library. Each customer/app (EI, TDA, DPD, SVT, ECHO, plus admin variants) is its own package under `packages/*`, built with Next.js (or CRA for `svt-app`) and consuming the shared `components` package. Each app is wired to a customer-specific backend API (`*.emergentcybernetics.net`) for crypto/options trading, wallet management, indexing, scanning, and authentication. The repo is the App/UI tier of the wider TradingPlatform/trading-tools-api ecosystem. (Note: current HEAD is branch `ARCHIVE-Before-Old-Project-Cleanup`, suggesting this is an archived snapshot.)

## 2. STACK
- Language: TypeScript (with some JS), React 18.
- Frameworks: Next.js ^14.2.3 (ei/tda/dpd/echo/mantis/admin apps); Create React App / react-scripts 5 (`svt-app`).
- Runtime: Node 20.x (`engines.node`, README requires Node v20.10+).
- Build tooling: Yarn 4.2.1 (`packageManager`), Lerna ^8.1.2 monorepo (`lerna.json`, `package.json` workspaces `packages/*`), Storybook for `components`, Jest for tests, ESLint/Prettier/Stylelint, Husky/lint-staged.
- Key dependencies (root `package.json`): `@mui/material` + `@mui/x-data-grid` (UI), `@reduxjs/toolkit`/`react-redux`/`redux-persist` (state), `axios`, `@microsoft/signalr` (realtime), `@ory/client`/`@ory/elements-react` (auth), `@stripe/stripe-js` (billing), `devextreme`/`devextreme-react`, `react-ts-tradingview-widgets`, `apexcharts`, `formik`+`yup`, `i18next`. `svt-app` adds `@dxfeed/api`, `react-query`, `rxjs`, `@chakra-ui/react`.

## 3. LAYER
**App/UI** — definitively a frontend monorepo.
- Evidence: `packages/` contains `ei-app`, `tda-app`, `dpd-app`, `svt-app`, `echo-app`, `mantis-app`, `mantis-seed-app`, `svt-admin-app`, `tda-admin-app`, and shared `components`.
- `packages/ei-app/package.json` scripts: `next dev`/`next build`/`next start`. `packages/svt-app/package.json` uses `react-scripts start/build`.
- Root `package.json` scripts are all `lerna run dev/build/start --scope <app>` per customer (e.g. `dev:ei`, `build:tda`, `start:dpd`).
- `packages/components/package.json` is a private React "UI Component Library" with Storybook (`storybook dev -p 6006`).
- No service host, broker SDK package, or generated API client is produced here; the apps consume remote HTTP/SignalR backends.

## 4. UPSTREAM DEPENDENCIES (references to the user's other repos)
No NuGet/npm/ProjectReference/submodule links to sibling repos. Cross-repo coupling is via hardcoded backend base URLs (the backends correspond to sibling `trading-tools-api_*` / SVT / token-sets repos):
- `packages/ei-app/.env.local:1` — `BACKEND_API_URL=https://ei-dev.emergentcybernetics.net` (EI backend; cf. sibling `trading-tools-api_EI`).
- `packages/tda-app/.env.local:3` — `NEXT_PUBLIC_BACKEND_API_URL=https://tda-api.emergentcybernetics.net` (cf. `trading-tools-api_TDA` / `tda-tools`).
- `packages/dpd-app/.env.local:1` — `API_BASE_URL=https://api.dpd-dev.emergentcybernetics.net` (cf. `trading-tools-api_DPD`).
- `packages/dpd-app/src/services/polygonTickerService.ts:4` and `optionTradeService.tsx:4` — hardcoded `https://api.dpd-dev.emergentcybernetics.net/...`.
- `packages/echo-app/.env.local:1` — `API_BASE_URL=https://tokensets-api.emergentcybernetics.net` (cf. `token-sets-script`).
- `packages/svt-app/.env.example:4-6` — SVT WordPress + backend API URLs (cf. `SVT-UI`, `svt-trading-tools`).
- Shared auth across apps: `ORY_SDK_URL=https://trading-tools-auth.emergentcybernetics.net` (ei/tda/dpd/echo `.env.local`; cf. `TradingPlatform.Ory`).
These are inferred mappings (URL/name correspondence), not declared package dependencies.

## 5. DOWNSTREAM CONSUMERS
None found. All packages are `"private": true`; the shared `components` package is consumed only internally by sibling apps within this same monorepo (root dep `"components": "^1.0.0"`). No sibling repo is shown to import this repo as a package.

## 6. EXTERNAL INTEGRATIONS
- Ory (Kratos/auth) — `@ory/client`, `@ory/elements-react`, `ORY_SDK_URL`, `packages/components/src/features/auth/lib/oryConfig.tsx`.
- Stripe (billing) — `@stripe/react-stripe-js`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` in `ei-app/.env.local`.
- Schwab (broker) — `dpd-app/src/common/SchwabConnectButton.tsx`, `symbolService.tsx` (`/api/schwab/...`).
- Polygon (market data) — `dpd-app/src/services/polygonTickerService.ts` (`/api/polygon/tickers/...`).
- Kraken (exchange) — `components/src/services/krakenService.ts`, `krakenSlice.ts`, `KrakenDialog.tsx`.
- DxFeed (market data) — `svt-app` `@dxfeed/api`, `dxFeedService.ts`, `DXFEED_*` env vars.
- CoinMarketCal (crypto calendar) — `ei-app/.env.local` `CALENDAR_EVENTS_URL=api.coinmarketcal.com`.
- DefiLlama — `LAMA_PROJECT_ICONS_URL=https://icons.llamao.fi`; `ei-app .../configureYieldsMocks.ts` `/api/defi/pools`.
- LiFi / 1inch / Uniswap (DeFi bridging/DEX) — `ei-app/src/features/tradeAggregator/lifiChains.ts`, `helpers/OneInchLinksGenerator.ts`, `UniswapLinksGenerator.ts`.
- TradingView widgets, Cloudflare Turnstile (`TURNSTILE_SITE_KEY`), SignalR realtime (`@microsoft/signalr`, `useSignalR.ts`), WordPress (SVT).

## 7. CUSTOMER MARKER
Multi-customer (not generic). Each app package is a distinct customer brand:
- **EI** (Elan Insights) — `ei-app`; logo `ElanInsightsLight.png` in `components/src/features/auth/ui/CustomLoginForm.tsx:196`; backend `ei-dev.emergentcybernetics.net`. Maps to sibling `trading-tools-api_EI` / `EiApp`.
- **TDA** — `tda-app` / `tda-admin-app`; backend `tda-api.emergentcybernetics.net`. Maps to `trading-tools-api_TDA` / `tda-tools`.
- **DPD** — `dpd-app`; backend `api.dpd-dev.emergentcybernetics.net`. Maps to `trading-tools-api_DPD`.
- **SVT** — `svt-app` / `svt-admin-app`; DxFeed + WordPress. Maps to `SVT-UI` / `svt-trading-tools`.
- **ECHO / TokenSets** — `echo-app`; backend `tokensets-api.emergentcybernetics.net`.
- Vendor: `components/package.json` author `EmergentCybernetics <info@emergentcybernetics.com>` (the developer/vendor, not a customer).
The `_EI/_DPD/_TDA` suffix pattern on sibling API repos corresponds one-to-one to these app packages.

## 8. ACTIVITY/HEALTH
- Lockfile: present — `yarn.lock` (~1.37 MB), Yarn 4 / `.yarnrc.yml`. 
- CI: none found (no `.github/workflows`, no CI YAML at root); Husky git hooks configured via `prepare` script.
- Tests: Jest configured (`jest.config.base.ts`, per-app `jest.config.ts`, `__tests__/`, msw mocks), but coverage appears light.
- Buildable as-is: UNKNOWN (not built/run here). Plausibly buildable given lockfile + pinned Node 20 + `packageManager` pin, but `.env.local` files reference `-dev` backends and contain test keys; some inconsistency (root `typescript: "*"`, mixed Next 14 vs CRA in svt-app).
- Maintained vs dormant: Likely DORMANT/archived — current branch is `ARCHIVE-Before-Old-Project-Cleanup` and README still references legacy CRA-era guidance. Treated as a pre-cleanup snapshot.

## 9. CONFIDENCE
LAYER confidence: **High**. The package layout (`packages/*-app`), Next.js/CRA build scripts, Storybook component library, and remote-backend HTTP/SignalR consumption are unambiguous frontend signals. Upstream-edge mapping to specific sibling API repos is **inferred from URL/name correspondence** (Med confidence) since no declared package/project references exist; confirming would require checking that each `*.emergentcybernetics.net` host is served by the matching `trading-tools-api_*` repo.
