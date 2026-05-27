import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NoWalletsPlaceholder } from "./NoWalletsPlaceholder";

const meta = {
  title: "EI App/TradeAggregator/NoWalletsPlaceholder",
  component: NoWalletsPlaceholder,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof NoWalletsPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
