import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import DefiTokensSection from "./DefiTokensSection";

const meta = {
  title: "EI App/Income/DefiTokensSection",
  component: DefiTokensSection,
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
    persisKey: "defi-pools-storybook",
    exportFileName: "liquidity-pools",
  },
} satisfies Meta<typeof DefiTokensSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
