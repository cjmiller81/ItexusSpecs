import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import PrivacyNoticeSection from "./Privacy";

const meta: Meta<typeof PrivacyNoticeSection> = {
  title: "EI App/Support/Privacy",
  component: PrivacyNoticeSection,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    Story => (
      <Box sx={{ p: 3, maxWidth: 960, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PrivacyNoticeSection>;

export const Default: Story = {};
