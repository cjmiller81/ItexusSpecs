import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { BridgeRouteCard } from "./BridgeRouteCard";

const chainsFixture = [
  { id: 1, name: "Ethereum" },
  { id: 42161, name: "Arbitrum" },
];

const baseRouteFixture = {
  id: "route-1",
  provider: "Mayan",
  fromAmount: "1000000000000000000",
  toAmount: "999800",
  toAmountMin: "994800",
  fromAmountUSD: "1000",
  toAmountUSD: "999.80",
  gasCostUSD: "0.06",
  tags: ["RECOMMENDED"],
  fromToken: { symbol: "DAI", decimals: 18, priceUSD: "1.00" },
  toToken: { symbol: "USDC", decimals: 6, priceUSD: "1.00" },
  steps: [
    {
      toolDetails: { name: "Mayan", key: "mayan" },
      type: "cross",
      action: {
        fromChainId: 1,
        toChainId: 42161,
        fromToken: { symbol: "DAI", decimals: 18 },
        toToken: { symbol: "USDC", decimals: 6 },
        fromAmount: "1000000000000000000",
      },
      estimate: {
        executionDuration: 35,
        toAmount: "999800",
        feeCosts: [],
        gasCosts: [{ amountUSD: "0.06" }],
      },
      includedSteps: [
        {
          tool: "mayan",
          toolDetails: { name: "Mayan", key: "mayan" },
          type: "cross",
          action: {
            fromChainId: 1,
            toChainId: 42161,
            fromToken: { symbol: "DAI", decimals: 18 },
            toToken: { symbol: "USDC", decimals: 6 },
            fromAmount: "1000000000000000000",
          },
          estimate: {
            toAmount: "999800",
            feeCosts: [],
            gasCosts: [{ amountUSD: "0.06" }],
          },
          label: "Bridge via Mayan",
        },
      ],
    },
  ],
};

const meta = {
  title: "EI App/TradeAggregator/BridgeRouteCard",
  component: BridgeRouteCard,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: 700, padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    route: baseRouteFixture,
    chains: chainsFixture,
    selected: false,
    expanded: false,
    index: 0,
    onSelect: () => {},
    onExpand: () => {},
  },
} satisfies Meta<typeof BridgeRouteCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Expanded: Story = {
  args: { selected: true, expanded: true },
};
