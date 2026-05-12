# Echo UI

A monorepo containing three Next.js trading-platform applications (`ei`, `echo`, `dpd`) and a shared React component library (`components`).

## Workspace layout

| Workspace | Description |
| --- | --- |
| `packages/ei-app` | EI web application (Next.js 14) |
| `packages/echo-app` | ECHO web application (Next.js 14) |
| `packages/dpd-app` | DPD web application (Next.js 14) |
| `packages/components` | Shared React component library, consumed by all three apps as a workspace dependency |

## Prerequisites

- **Node.js** ≥ 20.19 (or ≥ 22.12). This floor is set by Storybook 10.x / Vite 6 — earlier Node 20.x will install but won't run Storybook.
- **Corepack** enabled — ships with Node 16.10+. This auto-provisions the correct Yarn version from `"packageManager"` in `package.json` (Yarn 4.2.1). Enable it once per Node install:
  ```shell
  corepack enable
  ```
  > **Heads-up:** Corepack's `yarn` shim lives inside the *active* Node version's bin directory. If you switch Node versions later (e.g. via nvm), re-run `corepack enable` to recreate the shim under the new Node.
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
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
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

| File | Purpose |
| --- | --- |
| `packages/components/.storybook/main.ts` | Framework + addons + story glob (`../src/**/*.stories.@(ts\|tsx\|mdx)`) |
| `packages/components/.storybook/preview.ts` | Global parameters (controls, a11y) shared by every story |

Enabled addons:

- `@storybook/addon-docs` — autodocs from TS types + JSDoc
- `@storybook/addon-a11y` — accessibility checks via axe-core
- `msw-storybook-addon` — per-story HTTP mocking via [MSW](https://mswjs.io/), backed by `packages/components/public/mockServiceWorker.js`

### Writing stories

Stories live next to the components they document, under `packages/components/src/**/*.stories.tsx`. Two reference stories are included:

| Story | Demonstrates |
| --- | --- |
| `src/components/common/inputs/AppInputLabel.stories.tsx` | Plain prop-driven component with multiple visual variants and `argTypes` |
| `src/components/Header/ApiUsageStatus.stories.tsx` | Component that fetches data via `appAxios` — three stories (`Default`, `Loading`, `Error`) each provide their own MSW handler |

### Mocking HTTP in stories

For components that hit the network, declare MSW handlers under the story's `parameters.msw.handlers`:

```ts
import { delay, http, HttpResponse } from "msw"

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/some/endpoint", async () => {
          await delay("infinite")
          return HttpResponse.json({})
        }),
      ],
    },
  },
}
```

Use `"*/..."` path prefixes so handlers match regardless of the runtime `baseURL`. Requests that don't match any handler pass through to the network (`onUnhandledRequest: "bypass"`), keeping Storybook's own asset requests quiet.
