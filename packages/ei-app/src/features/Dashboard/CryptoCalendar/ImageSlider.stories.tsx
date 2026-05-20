import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import ImageSlider from "./ImageSlider";

const COIN_ICONS = [
  "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  "https://assets.coingecko.com/coins/images/4128/small/solana.png",
];

const meta: Meta<typeof ImageSlider> = {
  title: "EI App/Dashboard/ImageSlider",
  component: ImageSlider,
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <Box sx={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden" }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    imageUrls: COIN_ICONS,
  },
};

export default meta;

type Story = StoryObj<typeof ImageSlider>;

export const Default: Story = {};

export const SingleImage: Story = {
  args: {
    imageUrls: [COIN_ICONS[0]],
  },
};

export const SlowRotation: Story = {
  args: {
    period: 3000,
  },
};
