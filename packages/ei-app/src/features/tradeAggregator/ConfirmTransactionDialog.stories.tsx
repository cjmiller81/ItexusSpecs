import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ConfirmTransactionDialog } from "./ConfirmTransactionDialog";

const meta = {
  title: "EI App/TradeAggregator/Dialogs/ConfirmTransactionDialog",
  component: ConfirmTransactionDialog,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: () => {},
    onConfirmTransaction: () => {},
    selectedCEX: "Binance",
    tradeData: {
      mkt: "ETH/USDT",
      qty: "0.5",
      value: "$1,500.00",
      action: "buy",
    },
  },
} satisfies Meta<typeof ConfirmTransactionDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buy: Story = {};

export const Sell: Story = {
  args: {
    tradeData: {
      mkt: "BTC/USDT",
      qty: "0.025",
      value: "$1,750.00",
      action: "sell",
    },
  },
};
