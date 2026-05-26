import React, { useMemo } from "react";
import type { Decorator } from "@storybook/nextjs-vite";
// Next's internal App Router contexts. We mount them ourselves because
// `@storybook/nextjs-vite`'s `RouterDecorator` is mutually exclusive:
// it mounts `PageRouterProvider` *or* `AppRouterProvider` based on
// `parameters.nextjs.appDirectory`, never both. Pages under `src/pages/`
// need the Pages Router provider (so we leave `appDirectory` off), but
// they routinely embed shared components that call `useRouter` /
// `usePathname` from `next/navigation` (e.g. `use2FAVerification` inside
// `Require2FA`) — those throw "invariant expected app router to be
// mounted" without an App Router context above them in the React tree.
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  PathnameContext,
  SearchParamsContext,
  PathParamsContext,
} from "next/dist/shared/lib/hooks-client-context.shared-runtime";

import Layout from "@/Layouts/Layout";
import { StoreProvider } from "@/providers/StoreProvider";

const NOOP_APP_ROUTER = {
  push: async () => true,
  replace: async () => true,
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: async () => {},
} as const;

type NextjsRouterParams = {
  pathname?: string;
  asPath?: string;
  query?: Record<string, string | string[] | undefined>;
};

// The `AppRouterContext` value type is a private Next.js interface; the
// stub above only implements the methods our code actually calls, so we
// cast at the boundary rather than reproducing the full Next-internal
// shape here.
type AppRouterValue = React.ComponentProps<typeof AppRouterContext.Provider>["value"];

type AppPageShellInnerProps = {
  pathname: string;
  query: Record<string, string | string[] | undefined>;
  children: React.ReactNode;
};

const AppPageShellInner = ({ pathname, query, children }: AppPageShellInnerProps) => {
  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, v);
      } else if (value != null) {
        params.append(key, value);
      }
    }
    return params;
  }, [query]);

  const pathParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(query)) {
      if (value != null) params[key] = value;
    }
    return params;
  }, [query]);

  return (
    <AppRouterContext.Provider value={NOOP_APP_ROUTER as unknown as AppRouterValue}>
      <PathnameContext.Provider value={pathname}>
        <SearchParamsContext.Provider value={searchParams}>
          <PathParamsContext.Provider value={pathParams}>
            <StoreProvider>
              <Layout>{children}</Layout>
            </StoreProvider>
          </PathParamsContext.Provider>
        </SearchParamsContext.Provider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>
  );
};

/**
 * Production app store + main layout shell (sidebar, header, billing
 * bootstrap), wrapped in a minimal App Router context so `next/navigation`
 * hooks (`useRouter`, `usePathname`, `useSearchParams`, `useParams`)
 * resolve cleanly inside Pages-Router page stories. Reads pathname / query
 * from `parameters.nextjs.router` so both routers stay in sync.
 */
export const withAppPageShell: Decorator = (Story, ctx) => {
  const router = (ctx.parameters?.nextjs as { router?: NextjsRouterParams } | undefined)?.router;
  const pathname = router?.pathname ?? router?.asPath?.split("?")[0] ?? "/";
  const query = router?.query ?? {};
  return (
    <AppPageShellInner
      pathname={pathname}
      query={query}>
      <Story />
    </AppPageShellInner>
  );
};

export const defaultPageParameters = {
  layout: "fullscreen" as const,
};

type RouterParams = {
  asPath: string;
  pathname?: string;
  query?: Record<string, string | string[] | undefined>;
};

/** Pages Router mock with no-op navigation (avoids real route changes in Storybook). */
export function pageRouterParams({ asPath, pathname, query = {} }: RouterParams) {
  return {
    nextjs: {
      router: {
        asPath,
        pathname: pathname ?? asPath.split("?")[0],
        query,
        push: async () => true,
        replace: async () => true,
      },
    },
  };
}
