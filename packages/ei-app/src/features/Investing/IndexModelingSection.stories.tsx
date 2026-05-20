import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { IndexModelingSection } from "./IndexModelingSection";
import type { InvestingTableAsset } from "../../models/Wallet/InvestingTableAsset";

const sampleAssets: InvestingTableAsset[] = [
  { id: "btc", symbol: "BTC", price: 72_410, marketCap: 1_425_000_000_000, weight: 45, qty: 0.6, tokenId: "bitcoin" },
  { id: "eth", symbol: "ETH", price: 3_812, marketCap: 458_000_000_000, weight: 30, qty: 7.8, tokenId: "ethereum" },
  { id: "sol", symbol: "SOL", price: 168, marketCap: 78_000_000_000, weight: 12, qty: 71, tokenId: "solana" },
  { id: "bnb", symbol: "BNB", price: 624, marketCap: 91_000_000_000, weight: 8, qty: 12.8, tokenId: "binancecoin" },
  { id: "xrp", symbol: "XRP", price: 0.52, marketCap: 29_500_000_000, weight: 5, qty: 9_615, tokenId: "ripple" },
];

const meta = {
  title: "EI App/Investing/IndexModelingSection",
  component: IndexModelingSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: "100%", padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Market-cap weighted index",
    tableAssets: sampleAssets,
    onTokensChange: () => {},
    tokens: 5,
    weighted: 100,
    persistKey: "index-modeling-storybook",
  },
} satisfies Meta<typeof IndexModelingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EqualWeight: Story = {
  args: { isEqualWeight: true, title: "Equal-weighted index" },
};
