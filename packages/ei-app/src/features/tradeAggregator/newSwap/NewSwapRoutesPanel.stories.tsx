import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { NewSwapRoutesPanel } from "./NewSwapRoutesPanel";

const chainsFixture = [
  { id: 1, name: "Ethereum" },
  { id: 42161, name: "Arbitrum" },
];

const routesFixture = [
  {
    id: "swap-1",
    fromAmount: "500000000",
    toAmount: "499900000",
    toAmountMin: "498000000",
    fromAmountUSD: "500",
    toAmountUSD: "499.90",
    gasCostUSD: "0.02",
    tags: ["RECOMMENDED"],
    fromToken: { symbol: "USDC", decimals: 6, priceUSD: "1.00" },
    toToken: { symbol: "DAI", decimals: 18, priceUSD: "1.00" },
    steps: [
      {
        toolDetails: { name: "Uniswap V3", key: "uniswap-v3" },
        type: "swap",
        action: {
          fromChainId: 1,
          toChainId: 1,
          fromToken: { symbol: "USDC", decimals: 6 },
          toToken: { symbol: "DAI", decimals: 18 },
          fromAmount: "500000000",
        },
        estimate: {
          executionDuration: 8,
          toAmount: "499900000000000000000",
          feeCosts: [],
          gasCosts: [{ amountUSD: "0.02" }],
        },
        includedSteps: [
          {
            tool: "uniswap-v3",
            toolDetails: { name: "Uniswap V3", key: "uniswap-v3" },
            type: "swap",
            action: {
              fromChainId: 1,
              toChainId: 1,
              fromToken: { symbol: "USDC", decimals: 6 },
              toToken: { symbol: "DAI", decimals: 18 },
              fromAmount: "500000000",
            },
            estimate: {
              toAmount: "499900000000000000000",
              feeCosts: [],
              gasCosts: [{ amountUSD: "0.02" }],
            },
          },
        ],
      },
    ],
  },
];

const meta = {
  title: "EI App/TradeAggregator/NewSwap/NewSwapRoutesPanel",
  component: NewSwapRoutesPanel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: 720, padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    routes: [],
    chains: chainsFixture,
    loading: false,
    error: null,
    lastUpdated: null,
    hasRequested: false,
  },
} satisfies Meta<typeof NewSwapRoutesPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyAwaitingInput: Story = {};

export const WithRoutes: Story = {
  args: {
    hasRequested: true,
    routes: routesFixture,
    lastUpdated: "Just now",
  },
};
