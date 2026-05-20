import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import CexPage from "./index";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "../../storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/TradeAggregatorCex",
  component: CexPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/tradeAggregator/cex" }),
    msw: { handlers: pageStoryHandlers() },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof CexPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
