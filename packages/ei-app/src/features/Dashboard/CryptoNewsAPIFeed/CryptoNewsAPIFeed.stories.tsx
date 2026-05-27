import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { CryptoNewsAPIFeed } from "./CryptoNewsAPIFeed";

// Same data path as CryptoNewsTile but shows the wider Card layout used in
// the "Expand view" dialog. The search input dispatches to the same MSW
// handlers so typing tickers triggers the ticker endpoint.
const meta: Meta<typeof CryptoNewsAPIFeed> = {
  title: "EI App/Dashboard/CryptoNewsAPIFeed",
  component: CryptoNewsAPIFeed,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    Story => (
      <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", p: 2, minHeight: 720 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CryptoNewsAPIFeed>;

export const Default: Story = {};
