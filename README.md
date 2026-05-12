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

- **Node.js** ≥ 20.10 (declared in each workspace's `engines`)
- **Corepack** enabled — ships with Node 16.10+. This auto-provisions the correct Yarn version from `"packageManager"` in `package.json` (Yarn 4.2.1). If you've never used Corepack, enable it once:
  ```shell
  corepack enable
  ```
- **Git** — required for the pre-commit hook to work

You do **not** need to install Yarn or Lerna globally. Both are managed by the workspace.

## Initial setup

```shell
git clone <repo-url>
cd <repo>
yarn install
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

Storybook is configured for `packages/components` but not yet fully wired up. The current scripts (`yarn storybook`, `yarn build:storybook`) are placeholders pending the Storybook 10.x installation work tracked separately.
