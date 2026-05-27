import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { IndexResultsSection } from "./IndexResultsSection";
import type { InvestingTableAsset } from "../../models/Wallet/InvestingTableAsset";

const sampleAssets: InvestingTableAsset[] = [
  { id: "btc", symbol: "BTC", price: 72_410, marketCap: 1_425_000_000_000, weight: 45, qty: 0.6, tokenId: "bitcoin" },
  { id: "eth", symbol: "ETH", price: 3_812, marketCap: 458_000_000_000, weight: 30, qty: 7.8, tokenId: "ethereum" },
  { id: "sol", symbol: "SOL", price: 168, marketCap: 78_000_000_000, weight: 12, qty: 71, tokenId: "solana" },
  { id: "bnb", symbol: "BNB", price: 624, marketCap: 91_000_000_000, weight: 8, qty: 12.8, tokenId: "binancecoin" },
  { id: "xrp", symbol: "XRP", price: 0.52, marketCap: 29_500_000_000, weight: 5, qty: 9_615, tokenId: "ripple" },
];

const sampleWallets = [
  { address: "0xabc", walletId: "w-1", isValid: true, walletName: "Main", isPersonal: true, chainAssets: [] },
  { address: "0xdef", walletId: "w-2", isValid: true, walletName: "Trading", isPersonal: true, chainAssets: [] },
];

const meta = {
  title: "EI App/Investing/IndexResultsSection",
  component: IndexResultsSection,
  parameters: {
    layout: "fullscreen",
    // Preload wallets so the component doesn't dispatch fetchWallets on mount.
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
        selectedWallets: [],
        currentWalletsFilter: { isPersonal: false },
        portfolioWalletData: [],
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: "100%", padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Index results",
    tableAssets: sampleAssets,
    onWalletChange: () => {},
    onCapitalChange: () => {},
    capital: 1_000,
    onTokensChange: () => {},
    tokens: 5,
  },
} satisfies Meta<typeof IndexResultsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
