import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";

import { IncomeTile } from "./IncomeTile";
import type { PoolApiResponse } from "../../Income/Models/PoolApiResponse";
import type { PoolData } from "../../Income/Models/PoolData";

const makePool = (overrides: Partial<PoolData>): PoolData => ({
  chain: "ethereum",
  project: "aave-v3",
  symbol: "USDC",
  category: "Lending",
  tvlUsd: 100_000_000,
  apyBase: 4.1,
  apyReward: null,
  apy: 4.1,
  rewardTokens: null,
  pool: "pool-id-default",
  apyPct1D: 0.02,
  apyPct7D: 0.1,
  apyPct30D: 0.4,
  stablecoin: true,
  ilRisk: "no",
  exposure: "single",
  predictions: { predictionValue: 4.0, predictionDate: "2026-06-01" },
  poolMeta: null,
  mu: 4.0,
  sigma: 0.2,
  count: 365,
  outlier: false,
  underlyingTokens: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
  dex: ["aave"],
  dexFormatted: "Aave v3",
  il7d: null,
  apyBase7d: null,
  apyMean30d: 4.0,
  volumeUsd1d: null,
  volumeUsd7d: null,
  apyBaseInception: null,
  url: "https://app.aave.com/",
  ...overrides,
});

const samplePools: PoolData[] = [
  makePool({
    pool: "p-aave-usdc",
    chain: "ethereum",
    project: "aave-v3",
    symbol: "USDC",
    tvlUsd: 1_200_000_000,
    apy: 4.21,
  }),
  makePool({
    pool: "p-compound-usdt",
    chain: "ethereum",
    project: "compound-v3",
    symbol: "USDT",
    tvlUsd: 740_000_000,
    apy: 5.07,
  }),
  makePool({
    pool: "p-aave-eth",
    chain: "ethereum",
    project: "aave-v3",
    symbol: "WETH",
    tvlUsd: 520_000_000,
    apy: 2.74,
    stablecoin: false,
  }),
  makePool({
    pool: "p-curve-3pool",
    chain: "ethereum",
    project: "curve-dex",
    symbol: "3CRV",
    tvlUsd: 410_000_000,
    apy: 3.85,
  }),
  makePool({
    pool: "p-lido-steth",
    chain: "ethereum",
    project: "lido",
    symbol: "stETH",
    tvlUsd: 380_000_000,
    apy: 3.32,
    stablecoin: false,
  }),
  makePool({
    pool: "p-uniswap-eth-usdc",
    chain: "ethereum",
    project: "uniswap-v3",
    symbol: "ETH-USDC",
    tvlUsd: 290_000_000,
    apy: 7.91,
    stablecoin: false,
  }),
  makePool({
    pool: "p-aave-arb-usdc",
    chain: "arbitrum",
    project: "aave-v3",
    symbol: "USDC",
    tvlUsd: 210_000_000,
    apy: 6.12,
  }),
  makePool({
    pool: "p-radiant-arb-usdc",
    chain: "arbitrum",
    project: "radiant-v2",
    symbol: "USDC",
    tvlUsd: 130_000_000,
    apy: 8.45,
  }),
];

const sampleResponse: PoolApiResponse = {
  status: "success",
  data: samplePools,
};

const meta: Meta<typeof IncomeTile> = {
  title: "EI App/Dashboard/IncomeTile",
  component: IncomeTile,
  parameters: {
    layout: "centered",
    // `IncomeTile`'s props extend `DashboardTileProps`, which inherits from
    // MUI `StackProps` — bringing in `color` / `bgcolor` / `borderColor`
    // typed as `ResponsiveStyleValue<…>` (react-docgen "other"). Combined
    // with the preview-level matcher ``color: /(background|color)$/i``
    // (see `.storybook/preview.tsx`), autodocs would log
    //   "Addon controls: Control of type color only supports string,
    //    received 'other' instead".
    // Restrict the controls panel to the props this story actually varies.
    // (Same root cause and fix as `CryptoNewsTile.stories.tsx`.)
    controls: { include: ["title", "icon", "data", "loading"] },
  },
  decorators: [
    Story => (
      <Box sx={{ width: 760, height: 540 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Income",
    icon: <SavingsIcon fontSize="small" />,
    data: sampleResponse,
  },
};

export default meta;

type Story = StoryObj<typeof IncomeTile>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    data: undefined,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: { status: "success", data: [] },
  },
};
