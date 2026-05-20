import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { NewSwapTab } from "./NewSwapTab";

const tokenIconsFixture = {
  items: [
    { id: "usdc", sym: "USDC", name: "USD Coin", lURI: "", address: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    {
      id: "weth",
      sym: "WETH",
      name: "Wrapped Ether",
      lURI: "",
      address: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
    },
  ],
};

const lifiChainsFixture = [
  { id: 1, key: "ETH", name: "Ethereum", logoURI: "" },
  { id: 42161, key: "ARB", name: "Arbitrum", logoURI: "" },
];

const formatNumberWithCommas = (val: string) => val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const meta = {
  title: "EI App/TradeAggregator/NewSwap/NewSwapTab",
  component: NewSwapTab,
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
} satisfies Meta<typeof NewSwapTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
