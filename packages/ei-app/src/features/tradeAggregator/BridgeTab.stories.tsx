import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { BridgeTab } from "./BridgeTab";

const tokenIconsFixture = {
  items: [
    {
      id: "dai",
      sym: "DAI",
      name: "Dai Stablecoin",
      lURI: "",
      address: ["0x6b175474e89094c44da98b954eedeac495271d0f"],
    },
    { id: "usdc", sym: "USDC", name: "USD Coin", lURI: "", address: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
  ],
};

const lifiChainsFixture = [
  { id: 1, key: "ETH", name: "Ethereum", logoURI: "" },
  { id: 42161, key: "ARB", name: "Arbitrum", logoURI: "" },
  { id: 10, key: "OPT", name: "Optimism", logoURI: "" },
];

const formatNumberWithCommas = (val: string) => val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const meta = {
  title: "EI App/TradeAggregator/BridgeTab",
  component: BridgeTab,
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
    symbolOptionSwap: null,
    tokenIcons: tokenIconsFixture,
    handleCurrentPositionDropdownChange: () => {},
    inputSearchSwap: "",
    setInputSearchSwap: () => {},
    formatNumberWithCommas,
    newBalance: "",
    setNewBalance: () => {},
    selectedChain: "Ethereum",
    selectedTokenRow: null,
    setSelectedTokenRow: () => {},
    balanceRaw: undefined,
    setShowNoQuotesMessage: () => {},
    onOptionChangeSwap: () => {},
    tokenIconsSwapFor: tokenIconsFixture,
    symbolOptionSwapFor: null,
    onOptionChangeSwapFor: () => {},
    inputSearchSwapFor: "",
    setInputSearchSwapFor: () => {},
    setTokenIconsSwapFor: () => {},
    selectedBridgeToChainId: null,
    setSelectedBridgeToChainId: () => {},
    inputSearchBridgeToChain: "",
    setInputSearchBridgeToChain: () => {},
    onClearBridgeToTokenAddress: () => {},
    chains: lifiChainsFixture,
    bridgeFromTokenDecimals: 18,
    isUnsupported: false,
  },
} satisfies Meta<typeof BridgeTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
