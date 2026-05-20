import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";

import { CryptoNewsTile } from "./CryptoNewsTile";

// CryptoNewsTile dispatches `fetchNewsByCategoryAsync` on mount; the storied
// preview store includes `cryptoNewsSlice` and the preview-default MSW
// handlers reply to `/api/cryptonews/category` with a fixture, so the tile
// hydrates without any per-story wiring.
const meta: Meta<typeof CryptoNewsTile> = {
  title: "EI App/Dashboard/CryptoNewsTile",
  component: CryptoNewsTile,
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <Box sx={{ width: 480, height: 540 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Crypto news",
    icon: <ArticleIcon fontSize="small" />,
  },
};

export default meta;

type Story = StoryObj<typeof CryptoNewsTile>;

export const Default: Story = {};
