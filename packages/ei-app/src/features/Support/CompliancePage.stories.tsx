import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import ComplianceUserAgreement from "./CompliancePage";

const meta: Meta<typeof ComplianceUserAgreement> = {
  title: "EI App/Support/Compliance",
  component: ComplianceUserAgreement,
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

type Story = StoryObj<typeof ComplianceUserAgreement>;

export const Default: Story = {};
