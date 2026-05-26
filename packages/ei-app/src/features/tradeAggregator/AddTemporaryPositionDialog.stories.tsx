import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { dialogContainerDecorator } from "components/src/storybookMocks/dialogDocsDecorator";

import { AddTemporaryPositionDialog } from "./AddTemporaryPositionDialog";

const lifiChainsFixture = [
  { id: 1, key: "eth", name: "Ethereum", logoURI: "", coin: "ETH", mainnet: true },
  { id: 42161, key: "arb", name: "Arbitrum", logoURI: "", coin: "ETH", mainnet: true },
  { id: 10, key: "opt", name: "Optimism", logoURI: "", coin: "ETH", mainnet: true },
  { id: 8453, key: "base", name: "Base", logoURI: "", coin: "ETH", mainnet: true },
];

const stubT = (key: string) => key;

const meta = {
  title: "EI App/TradeAggregator/Dialogs/AddTemporaryPositionDialog",
  component: AddTemporaryPositionDialog,
  parameters: { layout: "centered" },
  // See `NoRouteDialog.stories.tsx` / `dialogDocsDecorator.tsx`. Bound the
  // modal to a sized card on the Docs page only.
  decorators: [dialogContainerDecorator(560)],
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: () => {},
    onAdd: () => {},
    setAddPositionError: () => {},
    addPositionError: "",
    lifiChains: lifiChainsFixture,
    lifiChainsLoading: false,
    lifiChainsError: false,
    t: stubT,
  },
} satisfies Meta<typeof AddTemporaryPositionDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { addPositionError: "Position already exists in the loaded wallet." },
};
