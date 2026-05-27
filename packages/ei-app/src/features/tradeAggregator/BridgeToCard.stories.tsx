import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, useTheme } from "@mui/material";

import { BridgeToCard } from "./BridgeToCard";

const lifiChainsFixture = [
  { id: 1, key: "ETH", name: "Ethereum", logoURI: "" },
  { id: 42161, key: "ARB", name: "Arbitrum", logoURI: "" },
  { id: 10, key: "OPT", name: "Optimism", logoURI: "" },
];

const tokenIconsFixture = {
  items: [
    { id: "usdc", sym: "USDC", name: "USD Coin", lURI: "", address: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { id: "usdt", sym: "USDT", name: "Tether", lURI: "", address: ["0xdac17f958d2ee523a2206206994597c13d831ec7"] },
  ],
};

const stubT = (key: string) => key;

// BridgeToCard takes the live MUI theme + i18n `t` as explicit props (so the
// upstream parent doesn't have to wire useTranslation in every render path).
// Wrap the story so we hand it the active theme from the preview ThemeProvider.
const Host = (props: Omit<React.ComponentProps<typeof BridgeToCard>, "t" | "theme">) => {
  const theme = useTheme();
  return (
    <BridgeToCard
      {...props}
      t={stubT}
      theme={theme}
    />
  );
};

const meta = {
  title: "EI App/TradeAggregator/BridgeToCard",
  component: Host,
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
    tokenIconsSwapFor: tokenIconsFixture,
    symbolOptionSwapFor: null,
    onOptionChangeSwapFor: () => {},
    inputSearchSwapFor: "",
    setInputSearchSwapFor: () => {},
    selectedBridgeToChainId: null,
    setSelectedBridgeToChainId: () => {},
    inputSearchBridgeToChain: "",
    setInputSearchBridgeToChain: () => {},
    lifiChains: lifiChainsFixture,
    lifiChainsLoading: false,
    lifiChainsError: false,
    bridgeToTokenAddress: null,
  },
} satisfies Meta<typeof Host>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LockedBeforeFromSelection: Story = {};

export const Unlocked: Story = {
  args: {
    symbolOptionSwap: { sym: "DAI", name: "Dai Stablecoin", chain: "Ethereum" },
    selectedBridgeToChainId: 42161,
    inputSearchBridgeToChain: "Arbitrum",
  },
};
