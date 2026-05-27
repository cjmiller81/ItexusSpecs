import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import SupportCenterSection from "./SupportCenterSection";

const meta: Meta<typeof SupportCenterSection> = {
  title: "EI App/Support/SupportCenter",
  component: SupportCenterSection,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    Story => (
      <Box sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SupportCenterSection>;

export const Default: Story = {};
