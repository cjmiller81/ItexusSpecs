import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { IconCell } from "./IconCell";

// IconCell is the renderer used by DataGrid cells that show a coin/asset
// row: a small icon followed by the symbol. The icon URL is preloaded via
// the useMemoizedImage hook, then swapped into the <img> element's src.
// In the apps, iconUrl typically points at a public CDN such as CoinGecko.

const meta = {
  title: "DataDisplay/DataGrid/IconCell",
  component: IconCell,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'DataGrid cell renderer that displays an asset icon next to its symbol. Pass `symbol` (e.g. `"BTC"`) and an optional `iconUrl`. The image is loaded asynchronously via `useMemoizedImage`, so the cell starts blank and the icon appears when the network round-trip completes.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    symbol: { control: "text" },
    iconUrl: { control: "text" },
  },
  decorators: [
    Story => (
      <Box sx={{ minWidth: 120 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof IconCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bitcoin: Story = {
  args: {
    symbol: "BTC",
    iconUrl: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
};

export const Ethereum: Story = {
  args: {
    symbol: "ETH",
    iconUrl: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
};

// Without an iconUrl the <img> falls back to its empty alt text. Useful
// to verify the cell still aligns its symbol text when the icon is
// unavailable (e.g. while data is loading or for assets without artwork).
export const NoIcon: Story = {
  args: {
    symbol: "UNKNOWN",
  },
};

export const LongSymbol: Story = {
  args: {
    symbol: "USDC.E",
    iconUrl: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
  },
};
