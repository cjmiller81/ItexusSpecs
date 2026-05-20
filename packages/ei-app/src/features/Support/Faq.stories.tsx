import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import FaqSection from "./Faq";

const meta: Meta<typeof FaqSection> = {
  title: "EI App/Support/Faq",
  component: FaqSection,
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

type Story = StoryObj<typeof FaqSection>;

export const Default: Story = {};
