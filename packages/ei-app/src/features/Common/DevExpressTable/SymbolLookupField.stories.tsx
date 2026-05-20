import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { SymbolLookupField } from "./SymbolLookupField";

const meta = {
  title: "EI App/Common/SymbolLookupField",
  component: SymbolLookupField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    text: "Bitcoin",
    iconUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  },
} satisfies Meta<typeof SymbolLookupField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithExternalLink: Story = {
  args: {
    text: "Ethereum",
    iconUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    url: "https://www.coingecko.com/en/coins/ethereum",
  },
};

export const CustomDimensions: Story = {
  args: {
    text: "SOL",
    iconUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    imgHeight: 40,
    imgWidth: 40,
  },
};
