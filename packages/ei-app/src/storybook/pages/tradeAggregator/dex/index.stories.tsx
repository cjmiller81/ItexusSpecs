import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import DexAggregatorPage from "@/pages/tradeAggregator/dex/index";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "@/storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/TradeAggregatorDex",
  component: DexAggregatorPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/tradeAggregator/dex" }),
    msw: { handlers: pageStoryHandlers() },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof DexAggregatorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
