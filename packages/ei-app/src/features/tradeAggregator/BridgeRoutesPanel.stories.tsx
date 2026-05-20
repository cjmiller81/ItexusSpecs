import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { BridgeRoutesPanel } from "./BridgeRoutesPanel";

const chainsFixture = [
  { id: 1, name: "Ethereum" },
  { id: 42161, name: "Arbitrum" },
];

const routesFixture = [
  {
    id: "r1",
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
          },
        ],
      },
    ],
  },
  {
    id: "r2",
    fromAmount: "1000000000000000000",
    toAmount: "995000",
    toAmountMin: "990000",
    fromAmountUSD: "1000",
    toAmountUSD: "995.00",
    gasCostUSD: "0.11",
    tags: ["FASTEST"],
    fromToken: { symbol: "DAI", decimals: 18, priceUSD: "1.00" },
    toToken: { symbol: "USDC", decimals: 6, priceUSD: "1.00" },
    steps: [
      {
        toolDetails: { name: "Stargate", key: "stargate" },
        type: "cross",
        action: {
          fromChainId: 1,
          toChainId: 42161,
          fromToken: { symbol: "DAI", decimals: 18 },
          toToken: { symbol: "USDC", decimals: 6 },
          fromAmount: "1000000000000000000",
        },
        estimate: {
          executionDuration: 120,
          toAmount: "995000",
          feeCosts: [],
          gasCosts: [{ amountUSD: "0.11" }],
        },
        includedSteps: [
          {
            tool: "stargate",
            toolDetails: { name: "Stargate", key: "stargate" },
            type: "cross",
            action: {
              fromChainId: 1,
              toChainId: 42161,
              fromToken: { symbol: "DAI", decimals: 18 },
              toToken: { symbol: "USDC", decimals: 6 },
              fromAmount: "1000000000000000000",
            },
            estimate: {
              toAmount: "995000",
              feeCosts: [],
              gasCosts: [{ amountUSD: "0.11" }],
            },
          },
        ],
      },
    ],
  },
];

const meta = {
  title: "EI App/TradeAggregator/BridgeRoutesPanel",
  component: BridgeRoutesPanel,
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
} satisfies Meta<typeof BridgeRoutesPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyAwaitingInput: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const NoRoutesFound: Story = {
  args: { hasRequested: true, routes: [] },
};

export const WithRoutes: Story = {
  args: {
    hasRequested: true,
    routes: routesFixture,
    lastUpdated: "Just now",
  },
};
