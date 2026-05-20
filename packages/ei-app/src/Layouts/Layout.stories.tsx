import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Paper, Typography } from "@mui/material";

import Layout from "./Layout";

const SamplePage = () => (
  <Paper sx={{ p: 3 }}>
    <Typography
      variant="h5"
      gutterBottom>
      Page content
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary">
      This area renders inside the main app shell below the header and beside the sidebar.
    </Typography>
  </Paper>
);

const meta = {
  title: "EI App/Layouts/Layout",
  component: Layout,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    children: <SamplePage />,
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SidebarClosed: Story = {
  parameters: {
    reduxState: {
      ui: {
        errors: [],
        messages: [],
        warnings: [],
        sidebarOpened: false,
        mode: "dark",
        accordions: {},
      },
    },
  },
};
