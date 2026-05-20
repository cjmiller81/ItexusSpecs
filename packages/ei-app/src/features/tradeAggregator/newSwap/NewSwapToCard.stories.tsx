import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, useTheme } from "@mui/material";

import { NewSwapToCard } from "./NewSwapToCard";

const lifiChainsFixture = [
  { id: 1, key: "ETH", name: "Ethereum", logoURI: "" },
  { id: 42161, key: "ARB", name: "Arbitrum", logoURI: "" },
];

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

const stubT = (key: string) => key;

const Host = (props: Omit<React.ComponentProps<typeof NewSwapToCard>, "t" | "theme">) => {
  const theme = useTheme();
  return (
    <NewSwapToCard
      {...props}
      t={stubT}
      theme={theme}
    />
  );
};

const meta = {
  title: "EI App/TradeAggregator/NewSwap/NewSwapToCard",
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
    swapToTokenAddress: null,
    selectedChain: "Ethereum",
    lifiChains: lifiChainsFixture,
  },
} satisfies Meta<typeof Host>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LockedBeforeFromSelection: Story = {};

export const Unlocked: Story = {
  args: {
    symbolOptionSwap: { sym: "DAI", name: "Dai Stablecoin", chain: "Ethereum" },
  },
};
