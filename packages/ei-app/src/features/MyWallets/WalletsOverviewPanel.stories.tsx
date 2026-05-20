import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { WalletsOverviewPanel } from "./WalletsOverviewPanel";

const sampleWallets = [
  {
    address: "0xabc",
    walletId: "w-1",
    isValid: true,
    walletName: "Main",
    isPersonal: true,
    chainAssets: [],
  },
  {
    address: "0xdef",
    walletId: "w-2",
    isValid: true,
    walletName: "Trading",
    isPersonal: true,
    chainAssets: [],
  },
];

const samplePortfolio = [
  {
    walletAddress: "0xabc",
    totalValueUSD: 125_400,
    lastUpdated: new Date().toISOString(),
    tokenHoldings: [
      {
        tokenAddress: "0x1",
        symbol: "ETH",
        tokenName: "Ethereum",
        balance: 12,
        balanceUSD: 41_000,
        price: 3416,
        chain: "Ethereum",
        logoUrl: "",
        decimals: 18,
      },
      {
        tokenAddress: "0x2",
        symbol: "USDC",
        tokenName: "USD Coin",
        balance: 24_000,
        balanceUSD: 24_000,
        price: 1,
        chain: "Ethereum",
        logoUrl: "",
        decimals: 6,
      },
    ],
    deFiPositions: [
      {
        protocol: "aave",
        positionType: "supplied",
        valueUSD: 18_400,
        network: "Ethereum",
        underlyingTokens: [],
        metadata: { label: "Aave v3", appId: "aave-v3", groupLabel: "Lending" },
      },
    ],
    nftHoldings: [
      {
        collectionName: "Bored Apes",
        collectionContractAddress: "0xbayc",
        tokenId: "1",
        estimatedValue: 42_000,
        imageUrl: {},
        network: "Ethereum",
      },
    ],
    breakdown: {
      tokensPercentage: 51,
      deFiPercentage: 15,
      nftsPercentage: 34,
      networkDistribution: {},
      protocolDistribution: {},
      positionTypeDistribution: {},
    },
  },
  {
    walletAddress: "0xdef",
    totalValueUSD: 12_200,
    lastUpdated: new Date().toISOString(),
    tokenHoldings: [
      {
        tokenAddress: "0x3",
        symbol: "ARB",
        tokenName: "Arbitrum",
        balance: 4_500,
        balanceUSD: 7_200,
        price: 1.6,
        chain: "Arbitrum",
        logoUrl: "",
        decimals: 18,
      },
    ],
    deFiPositions: [],
    nftHoldings: [
      {
        collectionName: "Pudgy Penguins",
        collectionContractAddress: "0xpp",
        tokenId: "12",
        estimatedValue: 5_000,
        imageUrl: {},
        network: "Ethereum",
      },
    ],
    breakdown: {
      tokensPercentage: 59,
      deFiPercentage: 0,
      nftsPercentage: 41,
      networkDistribution: {},
      protocolDistribution: {},
      positionTypeDistribution: {},
    },
  },
];

const meta = {
  title: "EI App/MyWallets/WalletsOverviewPanel",
  component: WalletsOverviewPanel,
  parameters: {
    layout: "centered",
    reduxState: {
      wallets: {
        wallets: sampleWallets,
        exchanges: null,
        statstatusCreatingWalletus: "idle",
        statusFetchingWallets: "idle",
        statusDeletingWallets: "idle",
        statusDeletingExchange: "idle",
        statusUpdatingWallets: "idle",
        statusFetchingExchanges: "idle",
        statusTotalWalletWorthFetching: "idle",
        statusFetchingPortfolio: "idle",
        selectedWallets: sampleWallets,
        currentWalletsFilter: { isPersonal: false },
        portfolioWalletData: samplePortfolio,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: 360 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof WalletsOverviewPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyPortfolio: Story = {
  parameters: {
    reduxState: {
      wallets: {
        wallets: [],
        exchanges: null,
        statstatusCreatingWalletus: "idle",
        statusFetchingWallets: "idle",
        statusDeletingWallets: "idle",
        statusDeletingExchange: "idle",
        statusUpdatingWallets: "idle",
        statusFetchingExchanges: "idle",
        statusTotalWalletWorthFetching: "idle",
        statusFetchingPortfolio: "idle",
        selectedWallets: [],
        currentWalletsFilter: { isPersonal: false },
        portfolioWalletData: [],
      },
    },
  },
};
