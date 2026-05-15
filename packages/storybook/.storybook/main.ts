import type { StorybookConfig } from "@storybook/nextjs-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Keep this module ESM-only — Storybook 10.4 auto-loads `.storybook/main.ts`
// via the ESM loader, so the CommonJS `__dirname` global is not available.
const moduleDir = dirname(fileURLToPath(import.meta.url));

// Repo root, used to widen Vite's `server.fs.allow` so this Storybook can
// serve story files and assets from sibling workspaces (`components`,
// `ei-app`, `echo-app`, `dpd-app`). Without this, Vite restricts `/@fs/...`
// to the package root and sibling sources fail to load.
const repoRoot = resolve(moduleDir, "../../..");

// Storybook 10.4 expects framework / addon entries to be absolute paths in
// hoisted monorepos (Yarn workspaces with `hoistingLimits: workspaces`).
// Resolving via `import.meta.resolve(<pkg>/package.json)` and stripping the
// filename guarantees the right copy is loaded regardless of the workspace
// layout.
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  // Stories live alongside source in each workspace; this Storybook host
  // discovers them through globs into the sibling packages.
  stories: [
    "../../components/src/**/*.stories.@(ts|tsx|mdx)",
    "../../ei-app/src/**/*.stories.@(ts|tsx|mdx)",
    "../../echo-app/src/**/*.stories.@(ts|tsx|mdx)",
    "../../dpd-app/src/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  // The MSW worker and shared static assets live in `packages/components/public`.
  staticDirs: ["../../components/public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  viteFinal: async config => {
    // Redirect imports of the Stripe packages to the in-tree mocks under
    // `.storybook/mocks/`. The mocks satisfy the surface the codebase
    // actually touches (`Elements`, `useStripe`, `useElements`, the three
    // card-input components, and `loadStripe`) without ever fetching
    // `js.stripe.com`. TypeScript resolution is unaffected — consumers still
    // see the real `@stripe/*` types from the installed packages, which
    // keeps the production build type-checked exactly the way it ships.
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...((config.resolve.alias as Record<string, string>) ?? {}),
      "@stripe/react-stripe-js": resolve(moduleDir, "./mocks/stripeMock.tsx"),
      "@stripe/stripe-js": resolve(moduleDir, "./mocks/stripeJsMock.ts"),
    };
    // Allow Vite to serve files from anywhere under the monorepo root —
    // sibling workspaces hold the story sources and their dependencies.
    config.server = config.server ?? {};
    config.server.fs = {
      ...(config.server.fs ?? {}),
      allow: [...(config.server.fs?.allow ?? []), repoRoot],
    };
    return config;
  },
};

export default config;
