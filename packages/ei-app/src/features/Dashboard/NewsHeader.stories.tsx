import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { NewsHeader } from "./NewsHeader";

const NOW_SECONDS = Math.floor(Date.now() / 1000);

const meta: Meta<typeof NewsHeader> = {
  title: "EI App/Dashboard/NewsHeader",
  component: NewsHeader,
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <Box sx={{ width: 360, p: 1 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    ago: NOW_SECONDS - 60 * 12,
    source: "CoinDesk",
    tokensIconsUrls: ["https://assets.coingecko.com/coins/images/1/small/bitcoin.png"],
  },
};

export default meta;

type Story = StoryObj<typeof NewsHeader>;

export const Default: Story = {};

export const MultipleIcons: Story = {
  args: {
    tokensIconsUrls: [
      "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    ],
  },
};

export const NoIcons: Story = {
  args: {
    tokensIconsUrls: [],
  },
};

export const OlderItem: Story = {
  args: {
    ago: NOW_SECONDS - 60 * 60 * 26,
    source: "Bloomberg",
  },
};
