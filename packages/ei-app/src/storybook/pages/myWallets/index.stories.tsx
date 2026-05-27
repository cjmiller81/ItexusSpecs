import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MyWalletsPage from "@/pages/myWallets/index";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "@/storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/MyWallets",
  component: MyWalletsPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/myWallets" }),
    msw: { handlers: pageStoryHandlers() },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof MyWalletsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
