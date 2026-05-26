import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { dialogContainerDecorator } from "components/src/storybookMocks/dialogDocsDecorator";

import { PlaceOrderResponseDialog } from "./PlaceOrderResponseDialog";

const stubT = (key: string) => key;

const meta = {
  title: "EI App/TradeAggregator/Dialogs/PlaceOrderResponseDialog",
  component: PlaceOrderResponseDialog,
  parameters: { layout: "centered" },
  // See `NoRouteDialog.stories.tsx` / `dialogDocsDecorator.tsx`. Bound the
  // modal to a sized card on the Docs page only.
  decorators: [dialogContainerDecorator(360)],
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: () => {},
    t: stubT,
  },
} satisfies Meta<typeof PlaceOrderResponseDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    response: {
      orderId: "ORD-001293",
      amount: "0.5",
      marketSymbol: "ETH/USDT",
      isBuy: true,
    },
    errors: null,
  },
};

export const Error: Story = {
  args: {
    response: null,
    errors: "Insufficient balance to place order.",
  },
};
