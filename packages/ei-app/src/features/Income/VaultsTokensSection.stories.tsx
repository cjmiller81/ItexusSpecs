import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import VaultsTokensSection from "./VaultsTokensSection";

const meta = {
  title: "EI App/Income/VaultsTokensSection",
  component: VaultsTokensSection,
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
    persisKey: "vaults-storybook",
    exportFileName: "vaults",
  },
} satisfies Meta<typeof VaultsTokensSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
