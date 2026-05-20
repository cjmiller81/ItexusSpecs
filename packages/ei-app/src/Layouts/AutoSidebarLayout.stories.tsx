import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

import AutoSidebarLayout from "./AutoSidebarLayout";
import Layout from "./Layout";

const SamplePage = () => (
  <Paper sx={{ p: 3 }}>
    <Typography
      variant="h5"
      gutterBottom>
      Auto sidebar layout
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary">
      Resize the viewport below the medium breakpoint to see the sidebar auto-collapse behavior.
    </Typography>
  </Paper>
);

// AutoSidebarLayout is a pass-through that listens for viewport width; compose it
// with Layout to mirror the production provider order in RootLayout.
const AppShell = ({ children }: { children: ReactNode }) => (
  <AutoSidebarLayout>
    <Layout>{children}</Layout>
  </AutoSidebarLayout>
);

const meta = {
  title: "EI App/Layouts/AutoSidebarLayout",
  component: AppShell,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    children: <SamplePage />,
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLayout: Story = {};
