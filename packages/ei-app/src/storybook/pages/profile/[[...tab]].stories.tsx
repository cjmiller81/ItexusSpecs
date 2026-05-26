import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { oryHandlers } from "components/src/storybookMocks/oryHandlers";

import ProfilePage from "@/pages/profile/[[...tab]]";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "@/storybook/pageStoryDecorators";

const profilePathname = "/profile/[[...tab]]";

const meta = {
  title: "EI App/Pages/Profile",
  component: ProfilePage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({
      asPath: "/profile/details",
      pathname: profilePathname,
      query: { tab: ["details"] },
    }),
    msw: {
      handlers: [...pageStoryHandlers(), oryHandlers.whoamiAuthenticated],
    },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Details: Story = {};

export const Wallets: Story = {
  parameters: {
    ...pageRouterParams({
      asPath: "/profile/wallets",
      pathname: profilePathname,
      query: { tab: ["wallets"] },
    }),
  },
};

export const Billing: Story = {
  parameters: {
    ...pageRouterParams({
      asPath: "/profile/billing",
      pathname: profilePathname,
      query: { tab: ["billing"] },
    }),
  },
};
