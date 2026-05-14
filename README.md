# Echo UI

A monorepo containing three Next.js trading-platform applications (`ei`, `echo`, `dpd`) and a shared React component library (`components`).

## Workspace layout

| Workspace             | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| `packages/ei-app`     | EI web application (Next.js 14)                                                      |
| `packages/echo-app`   | ECHO web application (Next.js 14)                                                    |
| `packages/dpd-app`    | DPD web application (Next.js 14)                                                     |
| `packages/components` | Shared React component library, consumed by all three apps as a workspace dependency |

## Prerequisites

- **Node.js** ≥ 20.19 (or ≥ 22.12). This floor is set by Storybook 10.x / Vite 6 — earlier Node 20.x will install but won't run Storybook.
- **Corepack** enabled — ships with Node 16.10+. This auto-provisions the correct Yarn version from `"packageManager"` in `package.json` (Yarn 4.2.1). Enable it once per Node install:
  ```shell
  corepack enable
  ```
  > **Heads-up:** Corepack's `yarn` shim lives inside the _active_ Node version's bin directory. If you switch Node versions later (e.g. via nvm), re-run `corepack enable` to recreate the shim under the new Node.
- **Git** — required for the pre-commit hook to work

You do **not** need to install Yarn or Lerna globally. Both are managed by the workspace.

### Windows + nvm-windows note

If you use [`nvm-windows`](https://github.com/coreybutler/nvm-windows), both `nvm use <version>` and `corepack enable` create symlinks under `C:\Program Files\nodejs\`, which Windows protects. Run those two commands once from a terminal opened with **Run as administrator**; afterwards you can use a normal terminal for the rest of the workflow.

## Initial setup

```shell
git clone <repo-url>
cd <repo>
yarn install
```

Verify your toolchain before continuing:

```shell
node -v          # ≥ 20.19.0 (or ≥ 22.12.0)
yarn --version   # 4.2.1
```

That's it. `yarn install` automatically:

- Installs dependencies for every workspace
- Runs the root `prepare` script, which initializes Husky and points Git's `core.hooksPath` at `.husky/`
- Activates the `pre-commit` hook (lint + type-check + format on staged files)

You can confirm Husky is active by running:

```shell
git config --get core.hooksPath
# Expected output: .husky/_
```

### Environment variables

Each app reads runtime config from its own `packages/<app>/.env.local` file (e.g. `BACKEND_API_URL`, `ORY_SDK_URL`, Stripe keys, etc.). Create that file before running the app. An example template lives at `packages/<app>/example.env` for reference where available.

## Running the apps

All app-level scripts live at the repo root and are parameterized by app shortname (`ei`, `echo`, `dpd`).

### EI app

```shell
yarn dev:ei            # dev server at https://localhost:3000 (also generates the local HTTPS cert)
yarn build:ei          # production build
yarn start:ei          # serve the production build (plain HTTP)
yarn start:ei:local    # serve the production build over HTTPS at https://localhost:3000 — see Local HTTPS below
yarn lint:ei           # lint just this app via Next.js
```

### Echo app

```shell
yarn dev:echo
yarn build:echo
yarn start:echo
yarn start:echo:local
yarn lint:echo
```

### DPD app

```shell
yarn dev:dpd
yarn build:dpd
yarn start:dpd
yarn start:dpd:local
yarn lint:dpd
```

### Local HTTPS

The `yarn start:<app>:local` scripts serve the production build over HTTPS at `https://localhost:3000` using a self-signed certificate. This is useful for testing flows that require a secure context locally (cookies with `Secure`, Web Crypto APIs, etc.).

The cert isn't checked into the repo — it's generated on demand by Next's `--experimental-https` flag, which is what `yarn dev:<app>` uses. Both `dev:<app>` and `start:<app>:local` then read it from the same location: `packages/<app>/certificates/localhost.pem` (and `localhost-key.pem`).

First-time setup for an app:

1. `yarn dev:<app>` once — Next generates the cert. You can stop the dev server as soon as it logs `> Ready on https://localhost:3000`.
2. `yarn build:<app>` — produce the production build.
3. `yarn start:<app>:local` — serves the production build over HTTPS using the cert from step 1.

After the first run you only need to redo step 1 if you delete the `certificates/` folder. Your browser will prompt to trust the self-signed cert the first time you visit; accept the warning to proceed.

## Code quality

The repo uses a single ESLint flat config at the root (`eslint.config.mjs`), Prettier for formatting, and the TypeScript compiler for type-checking. All three are enforced on every commit via Husky + lint-staged.

### Manual commands

```shell
yarn lint             # run ESLint across the whole repo
yarn format           # run Prettier --write across the whole repo
yarn format:check     # run Prettier --check (no writes); useful in CI
```

### Pre-commit hook

When you run `git commit`, Husky executes `npx lint-staged`. For each staged file under `packages/*/`, lint-staged runs:

1. `eslint --fix`
2. `tsc-files --noEmit` (type-checks only the staged TypeScript files against the workspace's `tsconfig.json`)
3. `prettier --write`

If any step fails, the commit is rejected. To bypass the hook intentionally (rare — e.g. emergency revert), use:

```shell
git commit --no-verify
```

### Editor integration (recommended)

For "format on save" and "fix on save" inside VS Code or Cursor, install:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

And add to your editor settings:

```jsonc
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
}
```

## Testing

```shell
yarn test         # run tests across all workspaces (via Lerna)
```

Each app uses Jest with Next.js's preset and `@testing-library/react`.

## Storybook

The `packages/components` library is wired up with **Storybook 10.x** using the [`@storybook/nextjs-vite`](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite) framework. The Vite-based Next.js framework provides the right runtime mocks (`next/link`, `next/image`, `next/router`, `next/navigation`, fonts, etc.) so components that depend on Next APIs render correctly in stories.

### Commands

```shell
yarn storybook         # start the Storybook dev server at http://localhost:6006
yarn build:storybook   # build the static Storybook site into packages/components/storybook-static/
```

Both commands delegate to the `components` workspace via Lerna.

### Configuration

| File                                                      | Purpose                                                                                                                                                                                                                                            |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/components/.storybook/main.ts`                  | Framework + addons + story glob + the Vite alias that redirects `@stripe/*` imports to the in-tree mocks under `.storybook/mocks/`                                                                                                                 |
| `packages/components/.storybook/preview.tsx`              | Global parameters (controls, a11y) and global decorators (Redux, i18n, MUI date pickers, MSW) shared by every story                                                                                                                                |
| `packages/components/.storybook/tsconfig.json`            | Dedicated tsconfig for the `.storybook/` directory so the IDE applies `jsx: "react-jsx"` and the bundler's wider `rootDir` to config files                                                                                                         |
| `packages/components/.storybook/mocks/stripeMock.tsx`     | Drop-in replacement for `@stripe/react-stripe-js` — see "Mocking Stripe" below                                                                                                                                                                     |
| `packages/components/.storybook/mocks/stripeJsMock.ts`    | Drop-in replacement for `@stripe/stripe-js` (`loadStripe`)                                                                                                                                                                                         |
| `packages/components/.storybook/mocks/billingHandlers.ts` | Default MSW handlers for `/api/billing/*` and `/api/request-tracking/status` registered globally in `preview.tsx`                                                                                                                                  |
| `packages/components/src/storybookMocks/oryHandlers.ts`   | MSW handlers + fixtures for the Ory Kratos public API (`*/sessions/whoami`, `*/self-service/<flow>/*`, `*/self-service/errors`) — opt-in per-story, see "Storying Ory page-level components" — lives under `src/` so story files satisfy `rootDir` |

Enabled addons:

- `@storybook/addon-docs` — autodocs from TS types + JSDoc
- `@storybook/addon-a11y` — accessibility checks via axe-core
- `msw-storybook-addon` — per-story HTTP mocking via [MSW](https://mswjs.io/), backed by `packages/components/public/mockServiceWorker.js`

`packages/components/public/` is the `staticDirs` root that Storybook serves at `/`. Today it carries `mockServiceWorker.js` (MSW), `oryIcon.svg` (consumed by `ProtectedByOryLabel`), and `ElanInsightsLight.png` (the default `NEXT_PUBLIC_ORY_CARD_IMAGE_URL` for `CustomLoginForm` / `CustomRecoveryForm`). When adding stories whose components reference a `/`-rooted asset that ships from the host apps, copy the file into `packages/components/public/` so the component renders without a 404.

Global decorators (every story is automatically wrapped in these — no per-story setup required):

- **`<Provider>` (Redux Toolkit)** — every story gets a fresh Storybook-only store combining every slice the apps use (`ui`, `wallets`, `kraken`, `billing`, `dex`, `reactour`). A fresh store per render keeps state from leaking between stories. Components calling `useAppSelector` / `useAppDispatch` work out of the box. Stories can preload slice state via `parameters.reduxState` — see "Driving Redux state from stories" below.
- **`ThemeProvider`** (MUI) — a dark-mode `createTheme()` instance is provided so any component that uses `@mui/system`'s `styled` directly (e.g. the `NumberInput` slot components) can read `theme.palette.*` without crashing. `@mui/material/styles`'s `styled` falls back to a default theme on its own, but `@mui/system`'s does not — having the provider explicit covers both. `CssBaseline` is rendered alongside so the canvas inherits the theme's `background.default`.
- **`I18nextProvider`** — components calling `useTranslation()` resolve cleanly. The Storybook-only i18next instance is initialized inside `preview.tsx` with a small `resources` object covering the `Common` and per-component namespaces; extend that object when storying a component whose `t()` keys aren't covered yet.
- **`LocalizationProvider`** with `AdapterDateFnsV3` — components using `@mui/x-date-pickers` (e.g. `AppDatePicker`) render without a per-story wrapper. Matches the adapter the apps use in `RootLayout`.
- **`OryGatewayContext.Provider`** — every story is wrapped in the same React context the production `OryAuthGateway` provides, with a default mock session that expires 1 hour from render time and async no-op stubs for every callback. Components calling `useOry()` (e.g. `Header`, `SessionWatcher`, `PasswordResetModal`) work without a per-story wrapper. Stories can override individual fields via `parameters.oryContext` — see "Driving Ory session from stories" below.

### Writing stories

Stories live next to the components they document, under `packages/components/src/**/*.stories.tsx`. Reference stories covering distinct patterns:

| Story                                                                               | Pattern demonstrated                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/common/inputs/AppInputLabel.stories.tsx`                            | Prop-driven presentational component with `argTypes` controls                                                                                                                                                                                                                                     |
| `src/components/common/TabSelector.stories.tsx`                                     | Interactive controlled component — a `render` function pairs the `value` arg with local state so clicking updates the UI                                                                                                                                                                          |
| `src/components/Header/ThemeToggler.stories.tsx`                                    | Required callback prop declared as `fn()` in `meta.args` — the type-safe template for any component with required `on*` props                                                                                                                                                                     |
| `src/components/DataDisplay/BasicTable.stories.tsx`                                 | Mock-data setup + sizing decorator (MUI `DataGrid` collapses without a sized parent)                                                                                                                                                                                                              |
| `src/components/modals/AppModal.stories.tsx`                                        | Modal with `open`/`onClose` — `Open` story renders the modal directly, `Closed` story uses local state + an "Open modal" button                                                                                                                                                                   |
| `src/components/modals/YesNoDialog.stories.tsx`                                     | Component using `useTranslation()` — works out of the box via the global `I18nextProvider` decorator                                                                                                                                                                                              |
| `src/components/common/inputs/AppDatePicker.stories.tsx`                            | Component using `@mui/x-date-pickers` — works out of the box via the global `LocalizationProvider` decorator                                                                                                                                                                                      |
| `src/components/common/FormInputs/AppFormCheckboxField.stories.tsx`                 | Formik-coupled field — each story wraps itself in a `<Formik>` via a `renderInFormik(initialValues)` factory                                                                                                                                                                                      |
| `src/components/common/FormInputs/AppFormTextField.stories.tsx`                     | Formik-coupled field with an error variant driven by `initialErrors` / `initialTouched` (no need for a validation schema in stories)                                                                                                                                                              |
| `src/components/Header/ApiUsageStatus.stories.tsx`                                  | Component that fetches data — three stories (`Default`, `Loading`, `Error`) each provide their own MSW handler under `parameters.msw.handlers`                                                                                                                                                    |
| `src/components/Header/StyledAppBar.stories.tsx`                                    | Pure styled MUI primitive — a `meta.decorators` wrapper supplies a sized, relatively-positioned frame so the AppBar's fixed-positioning doesn't clip the canvas                                                                                                                                   |
| `src/components/containers/StatePersistedAccordion.stories.tsx`                     | Redux-coupled component — stories use `parameters.reduxState` to preload `state.ui.accordions[persistKey]` for the expanded/collapsed variants                                                                                                                                                    |
| `src/components/containers/AppAccordionSection.stories.tsx`                         | Composition of a Redux-coupled component with a styled header — shows `headerChildren` for in-header buttons/chips alongside another `parameters.reduxState` variant                                                                                                                              |
| `src/components/Sidebar/SidebarItem.stories.tsx`                                    | Component that reads `next/router` via `useRouter()` — the `Selected` story drives `router.asPath` via `parameters.nextjs.router.asPath` to force the selected state                                                                                                                              |
| `src/components/Sidebar/SidebarSection.stories.tsx`                                 | Composition with parent-owned child state — an `InteractiveExpand` story tracks the per-item `open` map locally via `useState` and feeds it back through `onSetItemOpen`                                                                                                                          |
| `src/components/DataDisplay/DataGrid/IconCell.stories.tsx`                          | Cell-renderer story — wrapped in a sized decorator so the cell renders without a surrounding `DataGrid`; covers `iconUrl` present/missing variants                                                                                                                                                |
| `src/components/ChainChip.stories.tsx`                                              | Component whose styles live in a sibling `.css` file the component itself doesn't import — the story does `import "./ChainChip.css"` and wraps in a `theme-light`/`theme-dark` ancestor                                                                                                           |
| `src/components/common/inputs/DecimalInput.stories.tsx`                             | Controlled numeric input with `min`/`max`/`maxDecimals` — uses local state and surfaces the parsed value in a readout                                                                                                                                                                             |
| `src/components/common/inputs/NumberInput/AppNumberInput.stories.tsx`               | MUI Base `Unstable_NumberInput` with custom slot styling — demonstrates the controlled `(event, newValue) => void` onChange shape and fractional `step`                                                                                                                                           |
| `src/components/modals/WelcomeModal.stories.tsx`                                    | Modal whose copy comes from a dedicated i18n namespace — story relies on the `WelcomeModal` resources added to `preview.tsx` (extend `resources` similarly for any new namespace)                                                                                                                 |
| `src/components/Header/UserMenu.stories.tsx`                                        | Avatar IconButton that opens a portal-rendered MUI `Menu` — relies on the global `I18nextProvider` (`UserMenu` namespace) and uses `next/link` via the `AppLink` styled wrapper                                                                                                                   |
| `src/components/Sidebar/Sidebar.stories.tsx`                                        | End-to-end composition of `StyledDrawer` + `StyledDrawerHeader` + `SidebarSection` driven by a sample `SidebarItems[]` — disclaimer items pin to the bottom only when `open` is true                                                                                                              |
| `src/components/common/SessionWatcher.stories.tsx`                                  | Component that reads `useOry().session.expires_at` — stories override `parameters.oryContext.session.expires_at` to drive the hidden / warning / one-minute-left states                                                                                                                           |
| `src/components/Header/Header.stories.tsx`                                          | Full top-bar composition (`StyledAppBar` + `ApiUsageStatus` + `ThemeToggler` + `UserMenu`) — `WithSessionCountdown` overrides `parameters.oryContext` to force the renew chip on screen                                                                                                           |
| `src/components/modals/PasswordResetModal.stories.tsx`                              | Formik-validated dialog backed by `useOry().onChangePassword` — `SubmitFails` overrides `parameters.oryContext.onChangePassword` to throw, exercising the dispatched error branch                                                                                                                 |
| `src/components/FeatureAccessGuard.stories.tsx`                                     | Subscription-gated wrapper — every story preloads `state.billing` via `parameters.reduxState`; covers loading, allowed, denied-by-feature, denied-by-limit, and an all-features gallery                                                                                                           |
| `src/components/common/inputs/AppSymbolLookup/SymbolsLookup.stories.tsx`            | Controlled MUI Autocomplete with a virtualized listbox — uses an inline `ControlledRender` component for `useState` (the bare `render` arrow doesn't satisfy `react-hooks/rules-of-hooks`)                                                                                                        |
| `src/components/common/inputs/AppSymbolLookup/SymbolsLookupVirtualized.stories.tsx` | Paged virtualization wrapper around `SymbolsLookup` — `onFetchPage` returns synthetic data per page so a 1000-item dataset scrolls without an MSW handler; `SlowPages` adds a 400ms delay                                                                                                         |
| `src/components/common/inputs/AppSymbolLookup/CoinsLookup.stories.tsx`              | Multi-select coin picker rendered as a custom button + popper — relies on the `CoinsLookup` and `Common` i18n namespaces for the "Coins" / "Top N Coins" / "{n} selected" copy                                                                                                                    |
| `src/components/common/inputs/AppSymbolLookup/CoinsLookupVirtualized.stories.tsx`   | Paged virtualization wrapper around `CoinsLookup` — same `onFetchPage` shape as the symbols variant; reviewers can verify the Top N quick-selects against the partially-loaded buffer                                                                                                             |
| `src/components/containers/AppContainer.stories.tsx`                                | Pure styled `Box` with theme `divider` border + radius — used as the outer frame for every profile/billing section                                                                                                                                                                                |
| `src/features/profile/TopBordered.stories.tsx`                                      | Styled `Box` with a single 1px top border — the content surface inside `ProfileContainer`                                                                                                                                                                                                         |
| `src/features/profile/ProfileContainer.stories.tsx`                                 | Section frame composing `AppContainer` + `TopBordered` + an optional title row with an `endAdortment` slot — covers default, `endAdortment`, light-mode `contentBgColor`, and no-title variants                                                                                                   |
| `src/features/profile/ProfilePicture.stories.tsx`                                   | Avatar + Upload button section backed by `use-file-picker` — relies on the `ProfilePicture` i18n namespace; `Uploading` exercises the LoadingButton spinner                                                                                                                                       |
| `src/features/profile/Billing/components/StyledSwitch.stories.tsx`                  | Theme-coloured MUI Switch used in the billing pricing-period toggle                                                                                                                                                                                                                               |
| `src/features/profile/Billing/components/SelectableButton.stories.tsx`              | Outlined Button with a `selected` flag that swaps to `primary.main` — `SingleSelectGroup` demonstrates the canonical "pick one of N" usage                                                                                                                                                        |
| `src/features/profile/Billing/components/SaveChancelButtons.stories.tsx`            | Right-aligned Cancel / Save pair; labels resolve from the global `Common` namespace                                                                                                                                                                                                               |
| `src/features/profile/Billing/components/GooglePaySvg.stories.tsx`                  | SVG wordmark whose path colour reads from `theme.palette` — `isSelected` flips it to `primary.dark` to mark the active payment method                                                                                                                                                             |
| `src/features/profile/ProfileDetails.stories.tsx`                                   | Formik-validated profile form pre-filled from `useOry().session.identity.traits` — `EmptyTraits` and `DifferentUser` override `parameters.oryContext.session` to drive alternate identities                                                                                                       |
| `src/features/profile/SecurityContainer.stories.tsx`                                | Two-column Change-Password / TOTP panel — overrides `parameters.oryContext.settingsFlow.ui.nodes` to drive the QR-code, already-linked, and empty TOTP states                                                                                                                                     |
| `src/features/profile/Billing/BillingApiUsageCard.stories.tsx`                      | API usage card backed by an MSW handler for `*/api/request-tracking/status` — covers loading, default, near-limit, error, and missing-renewal-date variants                                                                                                                                       |
| `src/features/profile/Billing/components/PaymentTabs.stories.tsx`                   | Horizontal payment-method picker built from `SelectableButton`s — the `ControlledRender` wrapper owns `tab` via `useState` so clicking actually switches the active tab                                                                                                                           |
| `src/features/profile/Billing/components/PaymentCardTableRow.stories.tsx`           | Per-card row inside the payment-methods list — `IsDefault` swaps "Make default" for the filled Chip; `StackedRows` mirrors the divider styling `BillingSection` passes between consecutive rows                                                                                                   |
| `src/features/profile/Billing/components/PaymentMethodModal.stories.tsx`            | Wider variant of `AppModal` (700×400 min size) used for the payment-method flow — `ToggleFromButton` keeps `open` in `useState` so reviewers can re-open after dismissing                                                                                                                         |
| `src/features/profile/Billing/components/BillingPlan.stories.tsx`                   | Single subscription-tier card — every story preloads `state.billing.plans` + `products` via `parameters.reduxState` so the marketing list, interval toggle, and CTA copy all resolve                                                                                                              |
| `src/features/profile/Billing/components/PaymentMethodSelector.stories.tsx`         | Composition of `PaymentTabs` + per-tab body wrapped in `<Elements stripe={null}>` — `CryptoTab` uses a `play` function (`storybook/test` `userEvent` + `expect`) to switch tabs after render                                                                                                      |
| `src/features/profile/Billing/components/CardPaymentForm.stories.tsx`               | Full Stripe card-entry form running against the mock Stripe + global MSW billing handlers — `AttachReturnsError`, `AttachFails500`, and `DuplicateCard` drive the three submit-failure branches                                                                                                   |
| `src/features/profile/Billing/components/PaymentMethodEditor.stories.tsx`           | Edit-card panel — owns its own `<Elements>` provider that resolves to the mock via the Vite alias on `@stripe/stripe-js`'s `loadStripe`                                                                                                                                                           |
| `src/features/profile/Billing/BillingSection.stories.tsx`                           | End-to-end Billing tab orchestrator (`BillingContainer`) — `Default`, `NoSubscription`, `NoCards`, `PlansFetchFails`, `NearApiLimit` each override one MSW handler to drive the target state                                                                                                      |
| `src/features/myWallets/TotalWalletsWorthCard.stories.tsx`                          | MUI-only summary chip — `Positive` / `Negative` / `Flat` exercise the `growPercentage >= 0` branch that swaps icons and `success.*` / `error.*` palette tokens                                                                                                                                    |
| `src/features/myWallets/Pagination.stories.tsx`                                     | Pure presentational pager — static `FirstPage` / `MiddlePage` / `LastPage` / `SinglePage` / `WithoutItemCounts` for visual regressions, plus a `Controlled` variant that owns `page` via `useState` to QA the windowing math interactively                                                        |
| `src/features/myWallets/TransactionSyncStatus.stories.tsx`                          | "Last synced" pill backed by an MSW handler for `/api/wallet/:address/sync-status` — `Synced`, `Unavailable`, `Loading` (`delay("infinite")`), `ApiError`, and a `ProgressEvent` story whose `play` fires the global `walletSyncStatusUpdated` `CustomEvent` to drive the live progress branch    |
| `src/features/myWallets/TokenBadge.stories.tsx`                                     | Token transfer chip scoped under `.transaction-history` (imports `TransactionHistory.css`) — inbound with logo URL, outbound with initials fallback, and a small flex row of both                                                                                                                                 |
| `src/features/myWallets/DEX/NftCell.stories.tsx`                                    | DEX NFT list cell — `WithImage`, `PlaceholderOnly`, `BrokenImageFallsBack`, `LongLabels`, and numeric `tokenId`; image failures route through `useImageError` into the wallpaper placeholder                                                                                                                    |
| `src/features/myWallets/TransactionSyncButton.stories.tsx`                         | Wallet sync CTA with `TransactionHistory.css` + top-center `ToastContainer` — MSW for `POST …/sync` and `GET …/sync-status`; `PostFails` / `NoWalletSelected` use `play`, `CooldownFromStorage` primes `syncCooldownEnd`, `CompletesAfterPoll` waits for the 15s poll interval + success toast + `onSyncComplete`    |
| `src/features/myWallets/MarketCapWallet.stories.tsx`                                | Styled `BasicTable` grid for market-cap / index wallet rows — `Default` + `Empty`; same scroll / editing chrome as investing screens                                                                                                                                                                              |
| `src/features/myWallets/TransactionFilters.stories.tsx`                             | History toolbar (presets, `AppDatePicker` range, type filter, spam toggle) inside `.transaction-history`; `preview.tsx` adds `HistoricalWalletsWorth` + `Tooltips.Required`; `CustomRange` seeds a custom window                                                                                                    |
| `src/features/profile/BrokerageConnectionContainer.stories.tsx`                     | Schwab integration card — drives `isConnected` from both the `connectedAccounts` prop and `?isConnected=` via `parameters.nextjs.navigation.query` (with `appDirectory: true`); `RefreshTokenError` MSW-overrides `/api/schwab/auth/refreshToken` to a 500 to verify the catch-and-blank fallback |
| `src/layouts/AutoSidebarLayout.stories.tsx`                                         | Resize listener that collapses `ui.sidebarOpened` below the MUI `md` breakpoint — demo wiring plus `ClosesWhenViewportNarrows` `play` that stubs `window.innerWidth` and dispatches `resize`                                                                                                                      |
| `src/layouts/ToastifyLayout.stories.tsx`                                            | Redux-to-react-toastify bridge — buttons dispatch `addError` / `addMessage` so `ToastContainer` never sees preloaded non-empty queues on mount                                                                                                                                                                    |
| `src/layouts/DevextremeThemeProvider.stories.tsx`                                 | Toggles `ui.mode` while `themes.current('material.blue.dark' \| 'material.blue.light')` tracks DevExtreme skin selection                                                                                                                                                                                         |
| `src/layouts/toasts/ErrorToast.stories.tsx`                                         | One-shot custom error toast — click-revealed mount so `toast.error` does not fire on initial story load                                                                                                                                                                                                             |
| `src/layouts/toasts/SuccessToast.stories.tsx`                                       | Buy vs non-buy success chrome — dual buttons gate two `SuccessToast` mounts (`event.instruction === "Buy"` swaps the palette)                                                                                                                                                                                    |
| `src/features/auth/components/loader/Loader.stories.tsx`                            | Full-viewport SVG spinner shown while an Ory flow loads — no props, single `Default` story                                                                                                                                                                                                        |
| `src/features/auth/styled/styledAuthPrimitives.stories.tsx`                         | Auth spacing/link primitives — `MarginCard`, `ActionCard`, `CenterLink`, `TextLeftButton`, and `DocsButton` (`fn` on `onClick`) in one showcase                                                                                                                                                                |
| `src/features/auth/ui/protectedByOryLabel.stories.tsx`                              | Auth-page footer — `WithTermsLink`, `TermsFallback`, and `WithoutTerms` exercise the optional Terms-URL grid column; relies on `/oryIcon.svg` being copied into `packages/components/public/`                                                                                                     |
| `src/features/auth/ui/Messages.stories.tsx`                                         | Renders the `UiText[]` Ory attaches to every flow as MUI `<Alert>`s — `None`, `Info`, `Error`, `Mixed` cover the per-message severity routing and the `undefined → null` short-circuit                                                                                                            |
| `src/features/auth/ui/NodeAnchor.stories.tsx`                                       | Ory anchor node rendered as an MUI Button — uses fragment `href`s so the on-click `window.location.href = …` assignment stays inside the iframe                                                                                                                                                   |
| `src/features/auth/ui/NodeImage.stories.tsx`                                        | Ory image node — `Default` resolves through Storybook's `staticDirs` to `/oryIcon.svg`; `TotpQrCode` embeds an inline SVG `data:` URI shaped like a real QR code so the story has no static-asset dependency                                                                                      |
| `src/features/auth/ui/NodeText.stories.tsx`                                         | Ory text node — `PlainText` exercises the default `ScrollableCodeBox`; `LookupSecretsList` and `SingleSecretAsString` cover the two payload shapes (`UiText[]` vs single string) the `1050015` branch must normalise                                                                              |
| `src/features/auth/ui/NodeInputDefault.stories.tsx`                                 | Ory generic-input renderer (MUI `TextField`) — `Email`, `Password`, `TotpCode`, `Disabled` exercise the `attributes.type` passthrough; a colocated `ControlledRender` owns `value` and threads it back through the async `setValue` stub                                                          |
| `src/features/auth/ui/NodeInputCheckbox.stories.tsx`                                | Ory checkbox renderer — `Default`, `InitiallyChecked`, `Disabled`, `WithMessages` cover the `attributes.value` → `defaultChecked` mapping and the `node.messages` → HTML `title` tooltip                                                                                                          |
| `src/features/auth/ui/NodeInputSubmit.stories.tsx`                                  | Ory submit button — wrapped in a `<Box component="form">` so `type="submit"` has a real form to bind to; `Disabled` proves the `attributes.disabled \|\| disabled` OR-ing                                                                                                                         |
| `src/features/auth/ui/NodeInputButton.stories.tsx`                                  | Ory non-submit button (TOTP unlink, WebAuthn register) — exercises the normal `setValue(value).then(dispatchSubmit)` chain; the `attributes.onclick` WebAuthn branch is deliberately not exercised                                                                                                |
| `src/features/auth/ui/AuthContainer.stories.tsx`                                    | Bare styled `<main>` for auth pages — flex-centered, `100vh`-tall; storied as the positive control sibling of `StyledAuthContainer`                                                                                                                                                               |
| `src/features/auth/ui/StyledAuthContainer.stories.tsx`                              | Dark-themed wrapper (`#3E3E3E` ≥640px, `#2B2B2B` below) — `WithFooter` mirrors the production composition (`Stack` + card + `ProtectedByOryLabel`)                                                                                                                                                |
| `src/features/auth/ui/Node.stories.tsx`                                             | Discriminated-union dispatcher routing a `UiNode` to one of the slot-specific renderers — one story per branch (`ImageBranch`, `AnchorBranch`, `TextBranch`, `InputBranch`); the input branch sub-dispatches through `NodeInput`                                                                  |
| `src/features/auth/ui/NodeInput.stories.tsx`                                        | Input-type dispatcher (`hidden`, `checkbox`, `button`, `submit`, default text) — `HiddenBranch` wraps the otherwise-invisible `<input type="hidden">` in a `<details>` block so reviewers can confirm dispatch routing                                                                            |
| `src/features/auth/ui/Flow.stories.tsx`                                             | Class-component generic over `T extends Values` — fixtures cover `LoginFlow` (password-only, password+oidc filtered by `only`, `hideGlobalMessages`), an undefined-flow null-return, and a `SettingsFlow` variant; meta anchors the generic via `Flow<UpdateLoginFlowBody>`                       |
| `src/features/auth/ui/CustomLoginForm.stories.tsx`                                  | Branded sign-in card — `Default`, `TotpStepUp` (AAL2 `totp_code` input swaps the password block), `WithGlobalError` (`ui.messages` error), and `ExpiredFlow` (`isRefreshFlowIdNeeded: true` swaps in the refresh button); Turnstile gate is off by default (env var unset)                        |
| `src/features/auth/ui/CustomRecoveryForm.stories.tsx`                               | Two-stage recovery card — `EmailStage` (initial `choose_method`), `CodeStage` (`state === "sent_email"` swaps the email input for the code input + resend button), and `CodeStageWithError` (server-side error surfaced via the `Alert` strip)                                                    |
| `src/features/auth/ui/error.stories.tsx`                                            | Page-level Ory error renderer — covers the unknown / inline-`?error=…` / `?id=…` lookup paths, the authenticated "Return to App" branch, and the 404-from-lookup fallback; driven entirely by MSW handlers + `parameters.nextjs.router.query`                                                     |
| `src/features/auth/ui/login.stories.tsx`                                            | Page-level login orchestration — `Default` (fresh `createBrowserLoginFlow` + `setFlow` so the form mounts under Storybook's router), `LoadingFlow` (browser-flow delay), and `Aal2StepUp` (`?aal2=true` ⇒ TOTP step-up fixture)                                                                   |
| `src/features/auth/ui/recovery.stories.tsx`                                         | Page-level recovery orchestration — `Default` (initial `choose_method`), `SentEmailStage` (`?flow=<id>` ⇒ `sent_email` fixture), and `LoadingFlow`; flow id flows through `router.query.flow` so all three stories drive cleanly                                                                  |
| `src/features/auth/ui/settings.stories.tsx`                                         | Page-level settings orchestration — `Default` (create-flow), `WithFlowId` (rehydrate via `?flow=<id>`), and `LoadingFlow`; the fixture ships `profile` + `password` groups so two `SettingsCard`s render and the other group cards short-circuit to `null`                                        |
| `src/features/auth/ui/verification.stories.tsx`                                     | Page-level verification orchestration — same shape as settings (create / rehydrate / loading), with `Flow` rendered inside a `MarginCard` instead of per-group `SettingsCard`s                                                                                                                    |
| `src/features/auth/ui/registration.stories.tsx`                                     | Page-level registration orchestration — only the `Disabled` (Kratos returns `self_service_flow_disabled`) and `LoadingFlow` variants are storied; the happy path defers to `<Registration>` from `@ory/elements-react/theme` which carries its own internal session/flow plumbing                 |
| `src/features/auth/layouts/OryAuthGateway.stories.tsx`                              | App shell wrap from `RootLayout` — `whoamiAuthenticated` MSW so `toSession()` resolves; non-auth iframe pathname renders `children` after session load (`RendersChildrenWhenSessionLoaded` `play`); exports `OryAuthGatewayProps` on the layout component                                                      |

> **Story-coverage strategy:** start with the base components in `packages/components/src/` and work outward. Higher-level wrapper/feature components currently in the apps (e.g. `packages/ei-app/src/features/`) should be lifted into `packages/components` once their leaf dependencies are stable and storied — then they can get stories too.

### Mocking Stripe

Stripe-coupled billing components (`CardPaymentForm`, `PaymentMethodEditor`, `BillingSection`, plus anything that imports them transitively) are storied without ever fetching `js.stripe.com`. Two pieces make this work:

**Vite alias** (`.storybook/main.ts` → `viteFinal`) redirects both Stripe packages to in-tree mocks at build time:

- `@stripe/react-stripe-js` → `.storybook/mocks/stripeMock.tsx`
- `@stripe/stripe-js` → `.storybook/mocks/stripeJsMock.ts`

TypeScript resolution is unchanged — production code still type-checks against the real `@stripe/*` types — but at runtime every story (and every component a story renders) gets the mocks.

**What the mocks provide:**

- `<Elements>` — context provider that ignores its `stripe` prop and hands out a synchronous mock `Stripe` + `Elements` pair to descendants. `loadStripe(...)` resolves to the same instance, so `<Elements stripe={loadStripe(KEY)}>` and `<Elements stripe={null}>` both render the same canvas.
- `useStripe()` / `useElements()` — return the mocks from context.
- `CardNumberElement` / `CardExpiryElement` / `CardCvcElement` — styled placeholder divs (no iframe). They read `options.style.base` so dark/light theming still applies.
- `defaultMockStripe.createPaymentMethod(...)` resolves to a Visa `pm_storybook_4242` payload. Stories that need a failure path pass a custom Stripe to `<Elements>` via `makeFailingStripe("…")` (exported from `stripeMock.tsx`).

**Backend: default MSW handlers.** `preview.tsx` registers `defaultBillingHandlers` from `.storybook/mocks/billingHandlers.ts` under `parameters.msw.handlers`. Every endpoint `billingService` hits (`/api/billing`, `/api/billing/plans`, `/products`, `/paymentMethods`, `/subscriptions`, `/attach`, `/detachPaymentMethod`, `/setDefaultPaymentMethod`, `/paymentIntent`, `/updateSubscription`, `/cancelSubscription`) returns a populated fixture, so a story that wants the happy path adds no MSW config. Per-story overrides under `parameters.msw.handlers` win because MSW matches the last-registered handler first — `BillingSection.stories.tsx` and `CardPaymentForm.stories.tsx` are the canonical examples (empty-cards, plans-500, attach-fails, etc.).

**Building variant handlers from inline fixtures.** `.stories.tsx` files live under `src/` — the component library's `rootDir`. Importing from `.storybook/mocks/billingHandlers.ts` directly would cross that boundary and trip a TypeScript `rootDir` error in the IDE. Stories declare the minimal fixture data they need at the top of the file instead, keeping the shapes aligned with the global `defaultBillingHandlers` payloads. `BillingSection.stories.tsx`'s `firstPaymentMethod` / `apiUsageFixture` constants are the canonical examples:

```ts
import { http, HttpResponse } from "msw";

const singleCard = {
  id: "pm_storybook_4242",
  object: "payment_method",
  type: "card",
  card: { last4: "4242", exp_month: 12, exp_year: 2030, brand: "visa" },
};

export const SingleCard: Story = {
  parameters: {
    msw: {
      handlers: [http.get("*/api/billing/paymentMethods", () => HttpResponse.json([singleCard]))],
    },
  },
};
```

The `billingFixtures` export on `billingHandlers.ts` is still available for `.storybook/` consumers (e.g. additional decorators or other mock files inside the storybook tree).

### Driving Redux state from stories

For components that read from the Redux store via `useAppSelector`, preload the slice state under `parameters.reduxState`:

```ts
import type { UiState } from "../../slices/uiSlice";

const baseUi: UiState = {
  errors: [],
  messages: [],
  warnings: [],
  sidebarOpened: true,
  mode: "dark",
  accordions: {},
};

export const PreloadedExpanded: Story = {
  parameters: {
    reduxState: {
      ui: { ...baseUi, accordions: { "demo-accordion": true } },
    },
  },
};
```

A few notes on the shape:

- `reduxState` is a `Partial<RootState>` — omitted slices fall back to each slice's `initialState`.
- Provided slices **replace** rather than deep-merge, so spread a base slice (like `baseUi`) before overriding individual fields.
- The Redux Provider decorator builds a fresh store per story render, so dispatched actions inside a story (e.g. `setAccordionState`) only affect that render — they won't bleed into sibling stories.

### Driving `next/router` from stories

`@storybook/nextjs-vite` ships a mocked router that components calling `useRouter()` resolve to. To control router values for a specific story (most commonly to force a "selected" / active-route state), set them under `parameters.nextjs.router`:

```ts
export const Selected: Story = {
  parameters: {
    nextjs: {
      router: { asPath: "/wallets" },
    },
  },
  args: { item: { title: "Wallets", href: "/wallets", open: false } },
};
```

Calls like `router.push()` from inside the story are recorded as Storybook actions rather than triggering real navigation.

### Driving `next/navigation` from stories

App-Router components that read `useSearchParams()` / `useParams()` / `useSelectedLayoutSegment()` need an extra flag — `parameters.nextjs.appDirectory: true` — for the framework's `next/navigation` mocks to attach. Then `searchParams` get fed through `navigation.query`:

```ts
const meta = {
  component: BrokerageConnectionContainer,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/profile/brokerage",
        query: {}, // default: no search params
      },
    },
  },
} satisfies Meta<typeof BrokerageConnectionContainer>;

export const ConnectedFromBackend: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { query: { isConnected: "true" } },
    },
  },
};
```

`BrokerageConnectionContainer.stories.tsx` is the canonical example — its second `useEffect` keys off `?isConnected=true` to mirror the post-OAuth Schwab redirect, and the `query` override drives that branch without ever leaving the iframe.

### Driving Ory session from stories

The global Ory decorator (see "Global decorators" above) wraps every story in the same `OryGatewayContext` the production `OryAuthGateway` provides. The default value gives every story a logged-in session that expires **one hour** from render time plus async no-op stubs for every callback (`logOut`, `renewSession`, `onChangePassword`, etc.), so components calling `useOry()` work without setup. `createSettingsFow` returns a minimal stub `SettingsFlow` (`{ id: "storybook-settings-flow", ui: { nodes: [] } }`) so consumers like `PasswordResetModal` can call it from an effect without crashing — override per story if you need the flow to carry CSRF tokens or specific UI nodes.

To drive variant states — e.g. force the session-expiry countdown branch in `Header` or pop the warning dialog in `SessionWatcher` — override individual fields under `parameters.oryContext`:

```ts
export const WithSessionCountdown: Story = {
  parameters: {
    oryContext: {
      session: {
        id: "storybook-session",
        active: true,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        identity: {
          id: "storybook-identity",
          traits: {
            email: "demo@example.com",
            name: { first: "Demo", last: "User" },
            avatarUrl: "",
            newsletter: false,
          },
        },
      },
    },
  },
};
```

Overrides shallow-merge into the default — only specify the fields your component reads. For consumers that go beyond `session.*`, override the relevant callback directly:

```ts
parameters: {
  oryContext: {
    onChangePassword: async () => {
      throw new Error("password too weak");
    },
  },
}
```

The `OryGatewayContext` is exported from `packages/components/src/features/auth/layouts/OryAuthGateway.tsx` purely so test/preview environments (this Storybook setup, plus future Jest tests) can wrap components with mocked values. Production callers should still go through the `OryAuthGateway` component.

### Storying Ory `UiNode` renderers

The leaf renderers in `packages/components/src/features/auth/ui/` (`NodeAnchor`, `NodeImage`, `NodeText`, `NodeInputDefault`, `NodeInputCheckbox`, `NodeInputSubmit`, `NodeInputButton`, plus `Messages`) all consume slices of an Ory `SettingsFlow.ui.nodes[]` payload. Their props pair a generic `UiNode` with a more specific `UiNodeXxxAttributes` discriminant.

Stories build the fixture inline — there's no `.storybook/mocks/oryNodes.ts` to import from, because story files live under `src/` and that would cross the package's `rootDir`. Each story file declares a small `make<Type>Node` factory and the two or three `UiNodeXxxAttributes` objects it needs at the top:

```ts
const makeInputNode = (attributes: UiNodeInputAttributes, labelText: string): UiNode => ({
  type: "input",
  group: "default",
  attributes,
  meta: { label: { id: 1070002, text: labelText, type: "info" } },
  messages: [],
});

const emailAttrs: UiNodeInputAttributes = {
  name: "identifier",
  type: "email",
  required: true,
  node_type: "input",
  disabled: false,
};
```

For controlled input nodes (`NodeInputDefault`, `NodeInputCheckbox`) the story wraps the component in a colocated `ControlledRender` that owns `value` via `useState` and re-issues the async `setValue` stub:

```ts
const ControlledRender = (args: NodeInputProps) => {
  const [value, setValue] = useState<string>(args.value ?? "");
  return (
    <NodeInputDefault
      {...args}
      value={value}
      setValue={async next => {
        setValue(String(next ?? ""));
        await args.setValue(next);
      }}
    />
  );
};
```

`setValue` and `dispatchSubmit` use Storybook's `fn(async () => {})` so reviewers can see the call list in the Actions panel without the component crashing on `setValue(…).then(…)`. The WebAuthn branch in `NodeInputButton` / `NodeInputDefault` (`attributes.onclick`) is intentionally not exercised — it `eval`s a string of Ory-served JavaScript and depends on the global `window.__oryWebAuthnInitialized` flag.

### Storying Ory auth composites

The auth composites — `Flow`, `CustomLoginForm`, `CustomRecoveryForm` — accept a top-level `LoginFlow` / `RegistrationFlow` / `RecoveryFlow` / `SettingsFlow` / `VerificationFlow` and walk `flow.ui.nodes` themselves. Stories build one minimal full-flow fixture per scenario inline, then cast through `as any` at the boundary because Ory's flow shapes carry a wide `state` enum and a few non-discriminated-friendly fields:

```ts
const passwordFlow: LoginFlow = {
  id: "storybook-login-flow",
  type: "browser",
  expires_at: ISO_2026_01_01,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/login/browser",
  ui: {
    action: "https://example.test/self-service/login",
    method: "POST",
    messages: [],
    nodes: [
      /* csrf hidden, identifier email, password, submit, recovery/signup anchors */
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
```

Each story then narrows that base fixture: `TotpStepUp` rebuilds `ui.nodes` around a `totp_code` input, `WithGlobalError` overrides `ui.messages`, etc. The cast is intentional — typing every Ory-required field by hand (e.g. `identity` on `SettingsFlow`) adds a lot of code for fields the components under test never read.

`Flow<T>` is a class component generic over `T extends Values`. Storybook's `Meta<typeof Flow>` can't infer `T`, so the meta anchors it via `Flow<UpdateLoginFlowBody>` and stories override the `onSubmit` arg with a cast when feeding it a `SettingsFlow` (or any other body type). `Flow.stories.tsx` is the canonical example.

`CustomLoginForm` and `CustomRecoveryForm` are normally rendered inside `<StyledAuthContainer>` plus a centring `<Stack>` — stories use that exact pair as a `decorators` entry so the dark backdrop and centred card layout match production. The default logo (`NEXT_PUBLIC_ORY_CARD_IMAGE_URL` fallback) is `/ElanInsightsLight.png`; the file is copied into `packages/components/public/` so Storybook's `staticDirs` serves it under `/`.

### Storying Ory page-level components

The Pages-Router page components in `packages/components/src/features/auth/ui/` (`login.tsx`, `recovery.tsx`, `settings.tsx`, `verification.tsx`, `registration.tsx`, `error.tsx`) wrap the lower-level `CustomLoginForm` / `CustomRecoveryForm` / `Flow` renderers with the Ory SDK orchestration (`ory.toSession()`, `ory.createBrowser*Flow()`, `ory.get*Flow()`, `ory.update*Flow()`, `ory.getFlowError()`) plus `useRouter()` query-key driven flow rehydration. To story them we mock both halves:

- **HTTP:** `packages/components/src/storybookMocks/oryHandlers.ts` exports a named-bag of MSW handlers (`oryHandlers.whoamiUnauthenticated`, `oryHandlers.loginBrowser`, …, `oryHandlers.flowError`) plus the per-page `oryDefaultStacks` (`oryDefaultStacks.login`, `oryDefaultStacks.recoverySentEmail`, …) for the common compositions. Unlike `billingHandlers.ts`, these are **not** registered globally in `preview.tsx` — they're opt-in per-story via `parameters.msw.handlers` so non-auth stories don't pay the cost of intercepting every `*/sessions/whoami` call. The `oryFixtures` export ships the underlying flow + session + error fixtures so stories that need a deviation (e.g. a flow with extra `ui.messages`, or an authenticated session for the error page) can spread the base and override what they care about. The module lives under `src/storybookMocks/` (not `.storybook/mocks/`) so `*.stories.tsx` files satisfy the package `rootDir: "./src"` constraint.
- **Routing:** the page components read flow ids from `router.query.flow` (Pages Router) via `useRouter()` — set them per-story under `parameters.nextjs.router.query`. The framework's mocked router records `router.push` / `router.replace` calls as Storybook actions rather than firing real navigation, so success branches in `updateXxxFlow.then(...)` are harmless in the iframe.

```ts
import { oryHandlers, oryDefaultStacks } from "../../../storybookMocks/oryHandlers";

export const Default: Story = {
  parameters: {
    msw: { handlers: oryDefaultStacks.login },
    nextjs: { router: { query: {} } },
  },
};

export const SentEmailStage: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.recoveryFlowFetchSentEmail] },
    nextjs: { router: { query: { flow: "storybook-recovery-flow-sent" } } },
  },
};
```

A few sharp edges:

- **`login.tsx` — deep-link rehydration vs Storybook.** `createBrowserLoginFlow` now calls `setFlow(data)` immediately (matching `recovery.tsx`), so `Login` / `Default` renders `CustomLoginForm` once MSW returns the browser-flow payload even though Storybook's `router.replace` may not sync `window.location.search`. The **`getLoginFlow` path** in the first `useEffect` still gates on `URLSearchParams(window.location.search).has("flow")` _and_ `router.query.flow` — if those ever diverge in a harness, the fetch branch won't run; reach for an e2e test or align both surfaces.
- **`registration.tsx` defers the happy-path render to `<Registration>` from `@ory/elements-react/theme`.** That component carries its own internal session check + flow refresh + intl plumbing on top of the Ory SDK, which would need a much wider MSW handler stack than the rest of these stories use. Only the `self_service_flow_disabled` error pane and the `<Loader />` early-return are storied; the happy path is left for a follow-up batch (or, more likely, a dedicated visual regression against the `@ory/elements-react` exports themselves).
- **`window.location.replace` / `window.location.href = ...`** redirects (the success branches of `updateRecoveryFlow`, `updateSettingsFlow`, and the 404 fallback in `HandleError`) **do leave the iframe.** Stories that don't click submit avoid the redirect, but any reviewer who clicks "Submit" on `Recovery.SentEmailStage` will pop out to the Storybook root. That's not a regression — it's the production code path executing — and there's no clean way to intercept `window.location` without a global stub.

### Mocking HTTP in stories

For components that hit the network, declare MSW handlers under the story's `parameters.msw.handlers`:

```ts
import { delay, http, HttpResponse } from "msw";

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/some/endpoint", async () => {
          await delay("infinite");
          return HttpResponse.json({});
        }),
      ],
    },
  },
};
```

Use `"*/..."` path prefixes so handlers match regardless of the runtime `baseURL`. Requests that don't match any handler pass through to the network (`onUnhandledRequest: "bypass"`), keeping Storybook's own asset requests quiet.
