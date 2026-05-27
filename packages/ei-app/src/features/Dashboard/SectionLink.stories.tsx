import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import { fn } from "storybook/test";

import { SectionLink } from "./SectionLink";

const meta: Meta<typeof SectionLink> = {
  title: "EI App/Dashboard/SectionLink",
  component: SectionLink,
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    href: "/dashboard",
  },
};

export default meta;

type Story = StoryObj<typeof SectionLink>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    text: "Open details",
  },
};

export const ViewFullCalendar: Story = {
  args: {
    text: "View Full Calendar",
  },
};

export const WithOnClick: Story = {
  args: {
    text: "Click me",
    onClick: fn(),
  },
};
