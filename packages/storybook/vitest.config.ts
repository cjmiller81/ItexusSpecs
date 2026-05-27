import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, type Plugin } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

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

// When Storybook's UI runs coverage, the addon hard-codes Vitest's coverage
// reporter as the bare package subpath
// "@storybook/addon-vitest/internal/coverage-reporter". Vitest forwards that
// string to `istanbul-reports`, which `require()`s it from its own location.
//
// In this monorepo `istanbul-reports` is hoisted to <repoRoot>/node_modules,
// but `installConfig.hoistingLimits: "workspaces"` keeps `@storybook/addon-vitest`
// inside packages/storybook/node_modules. The require therefore fails with:
//   Cannot find module '@storybook/addon-vitest/internal/coverage-reporter'
//
// See https://github.com/storybookjs/storybook/issues/29785. As a workaround,
// resolve the reporter to an absolute path from this workspace (where the
// package IS visible) and rewrite the entry in `configureVitest`, which runs
// before Vitest initializes its coverage provider.
const storybookCoverageReporterId = "@storybook/addon-vitest/internal/coverage-reporter";
const storybookCoverageReporterPath = require.resolve(storybookCoverageReporterId);

const fixStorybookCoverageReporterPath: Plugin = {
  name: "fix-storybook-coverage-reporter-path",
  configureVitest({ vitest }) {
    const reporter = vitest.config.coverage?.reporter;
    if (!Array.isArray(reporter)) return;
    for (const entry of reporter) {
      if (Array.isArray(entry) && entry[0] === storybookCoverageReporterId) {
        entry[0] = storybookCoverageReporterPath;
      }
    }
  },
};

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
          // Must run after `storybookTest` so it can rewrite the reporter
          // entry the addon injects into Vitest's coverage config.
          fixStorybookCoverageReporterPath,
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
