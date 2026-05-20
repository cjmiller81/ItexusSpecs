import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { NewSwapFromCard } from "./NewSwapFromCard";

const tokenIconsFixture = {
  items: [
    { id: "eth", sym: "ETH", name: "Ether", lURI: "", address: ["0xeee"] },
    { id: "usdc", sym: "USDC", name: "USD Coin", lURI: "", address: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
  ],
};

const enrichedTokenRow = {
  chainId: 1,
  tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  balanceRaw: "5000000",
  tokenName: "USDC",
  logoUrl: "",
  decimals: 6,
  chain: "Ethereum",
  lifiChain: { logoURI: "", name: "Ethereum", key: "ETH" },
};

const formatNumberWithCommas = (val: string) => val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const meta = {
  title: "EI App/TradeAggregator/NewSwap/NewSwapFromCard",
  component: NewSwapFromCard,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: 540, padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    symbolOptionSwap: null,
    tokenIcons: tokenIconsFixture,
    handleCurrentPositionDropdownChange: () => {},
    inputSearchSwap: "",
    setInputSearchSwap: () => {},
    setSwapFromTokenAddress: () => {},
    formatNumberWithCommas,
    newBalance: "",
    setNewBalance: () => {},
    selectedTokenRow: null,
    setSelectedTokenRow: () => {},
    balanceRaw: undefined,
    setShowNoQuotesMessage: () => {},
    onOptionChangeSwap: () => {},
  },
} satisfies Meta<typeof NewSwapFromCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSelection: Story = {
  args: {
    symbolOptionSwap: tokenIconsFixture.items[1],
    selectedTokenRow: enrichedTokenRow,
    newBalance: "500",
    balanceRaw: 5,
  },
};
