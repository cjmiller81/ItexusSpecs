import type { StorybookConfig } from "@storybook/nextjs-vite";
import { existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import svgr from "vite-plugin-svgr";

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
    // Exclude `.svg` from the framework's bundled next-image plugin so it
    // doesn't intercept SVG imports and rewrite them to Next.js image
    // metadata objects (`{ src, width, height, blurDataURL }`). Without this,
    // every plain `import Icon from "./foo.svg"` resolves to that metadata
    // object instead of a React component, and `<Icon />` throws
    // "React.jsx: type is invalid … but got: object" — see the EI App
    // sidebar's social icons (`packages/ei-app/src/constants/sidebar.tsx`).
    //
    // With `.svg` excluded here, the next-image plugin returns `null` from
    // its `resolveId` for SVG paths, and the import flows through to
    // `vite-plugin-svgr` (configured in `viteFinal` below), which mirrors
    // the production Next.js `@svgr/webpack` rule and turns the SVG into a
    // React component.
    //
    // (The plugin itself logs `warnOnce("Detected vite-plugin-svgr but you
    // are not passing image include or exclude patterns to the nextjs-vite
    // plugin…")` when this option is missing.)
    options: {
      image: {
        excludeFiles: ["**/*.svg"],
      },
    },
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

    // Mirror the Next.js workspaces' `@svgr/webpack` rule (see
    // `packages/ei-app/next.config.js`) so every plain `.svg` ES import in
    // sibling sources resolves to a React component instead of a URL/object.
    // `sidebar.tsx` (and similar files) does:
    //
    //   import TelegramIcon from "../../public/telegram.svg";
    //   <TelegramIcon width={18} … />
    //
    // Without this plugin, `TelegramIcon` is not a component and
    // `<TelegramIcon />` throws "React.jsx: type is invalid … but got:
    // object", which surfaces in any story that mounts `Layout` (e.g. the
    // EI App/Layouts/* stories). This pairs with the framework's
    // `image.excludeFiles: ["**/*.svg"]` option above, which stops the
    // bundled next-image plugin from intercepting SVG imports first.
    //
    // The include filter is a regex (not the `**/*.svg?react` default glob)
    // because Vite's pipeline can append a postfix to the `id` passed to
    // `load()` (e.g. `?import`, `?used`). A `\.svg` regex matches both bare
    // paths and paths with any query string, so every variant is transformed.
    config.plugins = [
      ...(config.plugins ?? []),
      svgr({
        include: /\.svg(?:\?.*)?$/,
        svgrOptions: { exportType: "default" },
      }),
    ];

    return config;
  },
};

export default config;
