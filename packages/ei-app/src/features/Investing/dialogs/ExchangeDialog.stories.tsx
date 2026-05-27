import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { dialogContainerDecorator } from "components/src/storybookMocks/dialogDocsDecorator";

import { ExchangeDialog } from "./ExchangeDialog";

const meta = {
  title: "EI App/Investing/Dialogs/ExchangeDialog",
  component: ExchangeDialog,
  parameters: { layout: "centered" },
  // See `tradeAggregator/NoRouteDialog.stories.tsx` /
  // `dialogDocsDecorator.tsx`. Bound the modal to a sized card on the Docs
  // page only.
  decorators: [dialogContainerDecorator(560)],
  tags: ["autodocs"],
  args: {
    open: true,
    title: "Connect exchange",
    selectedService: ["Kraken", "Coinbase"],
    onClose: () => {},
    onServiceChange: () => {},
  },
} satisfies Meta<typeof ExchangeDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Exchanges: Story = {};

export const Wallet: Story = {
  args: {
    title: "Connect wallet",
    selectedService: ["MetaMask"],
  },
};
