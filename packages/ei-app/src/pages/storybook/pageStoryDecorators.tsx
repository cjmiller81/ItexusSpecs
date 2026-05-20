import type { Decorator } from "@storybook/nextjs-vite";

import Layout from "@/Layouts/Layout";
import { StoreProvider } from "@/providers/StoreProvider";

/** Production app store + main layout shell (sidebar, header, billing bootstrap). */
export const withAppPageShell: Decorator = Story => (
  <StoreProvider>
    <Layout>
      <Story />
    </Layout>
  </StoreProvider>
);

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
