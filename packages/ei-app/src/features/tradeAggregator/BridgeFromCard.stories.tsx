import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { BridgeFromCard } from "./BridgeFromCard";

import type { TokenSearchItem } from "@/models/Wallet/TokenSearchItem";

const tokenIconsFixture: { items: TokenSearchItem[] } = {
  items: [
    { id: "eth", sym: "ETH", name: "Ether", lURI: "", address: ["0xeee"], mCap: 250_000_000_000 },
    {
      id: "usdc",
      sym: "USDC",
      name: "USD Coin",
      lURI: "",
      address: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
      mCap: 30_000_000_000,
    },
    {
      id: "dai",
      sym: "DAI",
      name: "Dai Stablecoin",
      lURI: "",
      address: ["0x6b175474e89094c44da98b954eedeac495271d0f"],
      mCap: 5_000_000_000,
    },
  ],
};

const enrichedTokenRow = {
  chainId: 1,
  tokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  balanceRaw: "1000000000000000000",
  tokenName: "DAI",
  logoUrl: "",
  decimals: 18,
  chain: "Ethereum",
  lifiChain: { logoURI: "", name: "Ethereum", key: "ETH" },
};

const formatNumberWithCommas = (val: string) => val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const meta = {
  title: "EI App/TradeAggregator/BridgeFromCard",
  component: BridgeFromCard,
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
    formatNumberWithCommas,
    newBalance: "",
    setNewBalance: () => {},
    selectedTokenRow: null,
    setSelectedTokenRow: () => {},
    balanceRaw: undefined,
    setShowNoQuotesMessage: () => {},
    onOptionChangeSwap: () => {},
  },
} satisfies Meta<typeof BridgeFromCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSelection: Story = {
  args: {
    symbolOptionSwap: tokenIconsFixture.items[2],
    selectedTokenRow: enrichedTokenRow,
    newBalance: "1.5",
    balanceRaw: 2.4521,
  },
};
