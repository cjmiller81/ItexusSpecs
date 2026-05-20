import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SelectWalletPlaceholder } from "./SelectWalletPlaceholder";

const meta = {
  title: "EI App/TradeAggregator/SelectWalletPlaceholder",
  component: SelectWalletPlaceholder,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectWalletPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
