import type { StorybookConfig } from "@storybook/nextjs-vite";
import { existsSync, statSync } from "node:fs";
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
  staticDirs: ["../../components/public", "../../ei-app/public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    // Configure react-docgen-typescript so it can introspect prop types for
    // components stored in sibling workspaces (`components`, `ei-app`,
    // `echo-app`, `dpd-app`).
    //
    // - `tsconfigPath`: points at `.storybook/tsconfig.json`, which `include`s
    //   `.tsx` sources from every storied workspace. This is what feeds the
    //   plugin's TypeScript Program.
    // - `include`: the plugin globs these patterns from Vite's root and
    //   intersects the result with the TS Program's file set. The plugin's
    //   default (`**/*.tsx`) is anchored to `packages/storybook/`, so it
    //   misses sibling workspace files. Absolute, repo-rooted globs cover
    //   every workspace explicitly. POSIX-style forward slashes keep the
    //   `glob` package happy on Windows.
    reactDocgenTypescriptOptions: {
      tsconfigPath: ".storybook/tsconfig.json",
      include: [
        `${repoRoot.replace(/\\/g, "/")}/packages/storybook/.storybook/**/*.tsx`,
        `${repoRoot.replace(/\\/g, "/")}/packages/components/src/**/*.tsx`,
        `${repoRoot.replace(/\\/g, "/")}/packages/ei-app/src/**/*.tsx`,
        `${repoRoot.replace(/\\/g, "/")}/packages/echo-app/src/**/*.tsx`,
        `${repoRoot.replace(/\\/g, "/")}/packages/dpd-app/src/**/*.tsx`,
      ],
    },
  },
  viteFinal: async config => {
    // Each Next.js app workspace (`ei-app`, `echo-app`, `dpd-app`) declares
    // the same tsconfig path alias `"@/*": ["./src/*"]`, which Next + the
    // per-app vite resolves natively. When Storybook compiles a sibling
    // workspace's component here, that alias is not in scope and any
    // `@/foo` import would 404 (see vite:import-analysis errors).
    //
    // Resolve it manually based on the importer's path — whichever app
    // directory the file lives in is the one whose `src/*` we map to.
    //
    // Existing alias entries (e.g. the Stripe mocks below) stay as a plain
    // map; we convert to the array form expected by `@rollup/plugin-alias`
    // so the `customResolver` entry can sit alongside them.
    const APP_WORKSPACES = ["ei-app", "echo-app", "dpd-app"] as const;
    // Extensions Vite would try if the resolver hadn't intercepted; we have
    // to probe these manually because `/@id/<abs-path>` URLs don't go
    // through Vite's `resolve.extensions` step in the browser fetch path.
    const EXT_CANDIDATES = [
      "",
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".mjs",
      ".json",
      "/index.ts",
      "/index.tsx",
      "/index.js",
      "/index.jsx",
    ];

    function probeWithExtensions(basePath: string): string | null {
      for (const ext of EXT_CANDIDATES) {
        const candidate = basePath + ext;
        try {
          if (existsSync(candidate) && statSync(candidate).isFile()) {
            return candidate;
          }
        } catch {
          // ignore stat errors and keep probing
        }
      }
      return null;
    }

    const workspaceAlias = {
      find: /^@\/(.+)$/,
      replacement: "$1",
      customResolver: (source: string, importer?: string) => {
        if (!importer) return null;
        const importerPosix = importer.replace(/\\/g, "/");
        // `source` here is the post-`replacement` string (`@rollup/plugin-alias`
        // applies the regex before invoking customResolver), e.g.
        // `"constants/prefilterKeys"`. Belt-and-braces strip leading `@/`
        // if it ever survives, just in case the plugin's behaviour changes.
        const cleanSource = source.replace(/^@\//, "");
        for (const ws of APP_WORKSPACES) {
          if (importerPosix.includes(`/packages/${ws}/`)) {
            const base = resolve(repoRoot, "packages", ws, "src", cleanSource);
            return probeWithExtensions(base);
          }
        }
        return null;
      },
    };

    // Redirect imports of the Stripe packages to the in-tree mocks under
    // `.storybook/mocks/`. The mocks satisfy the surface the codebase
    // actually touches (`Elements`, `useStripe`, `useElements`, the three
    // card-input components, and `loadStripe`) without ever fetching
    // `js.stripe.com`. TypeScript resolution is unaffected — consumers still
    // see the real `@stripe/*` types from the installed packages, which
    // keeps the production build type-checked exactly the way it ships.
    config.resolve = config.resolve ?? {};
    const existingAlias = config.resolve.alias;
    const existingAliasArray = Array.isArray(existingAlias)
      ? existingAlias
      : existingAlias
        ? Object.entries(existingAlias).map(([find, replacement]) => ({ find, replacement }))
        : [];
    config.resolve.alias = [
      workspaceAlias,
      { find: "@stripe/react-stripe-js", replacement: resolve(moduleDir, "./mocks/stripeMock.tsx") },
      { find: "@stripe/stripe-js", replacement: resolve(moduleDir, "./mocks/stripeJsMock.ts") },
      ...existingAliasArray,
    ];

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
