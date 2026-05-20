import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import LiquidityPoolsPage from "./index";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "../storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/LiquidityPools",
  component: LiquidityPoolsPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/liquidity_pools" }),
    msw: { handlers: pageStoryHandlers() },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof LiquidityPoolsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
