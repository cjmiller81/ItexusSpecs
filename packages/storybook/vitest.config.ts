import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Repo root (two levels up from packages/storybook).
//
// Yarn hoists `@storybook/addon-vitest` to <repoRoot>/node_modules, which is
// outside this workspace. Story sources also live in sibling workspaces
// (`components`, `ei-app`, `echo-app`, `dpd-app`). Without widening
// `server.fs.allow` to the monorepo root, Vite's browser server refuses to
// serve any of these via `/@fs/...` — surfacing as either the addon's
// auto-injected setup-file.js failing to fetch
// (https://github.com/storybookjs/storybook/issues/33030) or sibling story
// modules failing to import.
//
// We don't use Vite's `searchForWorkspaceRoot` here because some workspace
// `package.json` files carry a (legacy yarn-v1) `workspaces` field, which
// causes that helper to stop at the package directory rather than climbing
// to the real monorepo root.
const workspaceRoot = path.resolve(dirname, "..", "..");

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
            // Matches `scripts.storybook` in this workspace's package.json.
            // Used by the addon to start Storybook on demand in watch mode.
            storybookScript: "yarn storybook --no-open",
          }),
        ],
        server: {
          fs: {
            allow: [workspaceRoot],
          },
        },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
