import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import { TopTokensTile, type TopTokenData } from "./TopTokensTile";

const sampleTokens: TopTokenData[] = [
  {
    id: "bitcoin",
    tokenId: "bitcoin",
    symbol: "btc",
    iconUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    price: 72_410.55,
    marketCap: 1_425_000_000_000,
    fulDilVal: 1_520_000_000_000,
  },
  {
    id: "ethereum",
    tokenId: "ethereum",
    symbol: "eth",
    iconUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    price: 3_812.92,
    marketCap: 458_000_000_000,
    fulDilVal: 458_000_000_000,
  },
  {
    id: "solana",
    tokenId: "solana",
    symbol: "sol",
    iconUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    price: 168.41,
    marketCap: 78_000_000_000,
    fulDilVal: 96_000_000_000,
  },
  {
    id: "bnb",
    tokenId: "bnb",
    symbol: "bnb",
    iconUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    price: 624.13,
    marketCap: 91_000_000_000,
    fulDilVal: 91_000_000_000,
  },
  {
    id: "xrp",
    tokenId: "xrp",
    symbol: "xrp",
    iconUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    price: 0.5274,
    marketCap: 29_500_000_000,
    fulDilVal: 52_740_000_000,
  },
];

const meta: Meta<typeof TopTokensTile> = {
  title: "EI App/Dashboard/TopTokensTile",
  component: TopTokensTile,
  parameters: {
    layout: "centered",
    // `TopTokensTile`'s props extend `DashboardTileProps`, which inherits
    // from MUI `StackProps` — bringing in `color` / `bgcolor` / `borderColor`
    // typed as `ResponsiveStyleValue<…>` (react-docgen "other"). Combined
    // with the preview-level matcher ``color: /(background|color)$/i``
    // (see `.storybook/preview.tsx`), autodocs would log
    //   "Addon controls: Control of type color only supports string,
    //    received 'other' instead".
    // Restrict the controls panel to the props this story actually varies.
    // (Same root cause and fix as `CryptoNewsTile.stories.tsx`.)
    controls: { include: ["title", "icon", "tableAssets", "loading"] },
  },
  decorators: [
    Story => (
      <Box sx={{ width: 720, height: 480 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Top tokens by market cap",
    icon: <LeaderboardIcon fontSize="small" />,
    tableAssets: sampleTokens,
  },
};

export default meta;

type Story = StoryObj<typeof TopTokensTile>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    tableAssets: null,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    tableAssets: [],
  },
};
