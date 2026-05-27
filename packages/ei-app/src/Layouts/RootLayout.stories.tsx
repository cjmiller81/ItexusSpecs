import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Paper, Typography } from "@mui/material";
import type { AppProps } from "next/app";
import { oryHandlers } from "components/src/storybookMocks/oryHandlers";

import RootLayout from "./RootLayout";

// RootLayout extends Next.js AppProps; supply minimal stubs so Storybook's
// Meta typing is satisfied without mounting a real page Component.
const stubAppProps = {
  pageProps: {},
  Component: () => null,
  router: {} as AppProps["router"],
} as AppProps;

const SamplePage = () => (
  <Paper sx={{ p: 3 }}>
    <Typography
      variant="h5"
      gutterBottom>
      Production app shell
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary">
      RootLayout composes Ory auth, Redux persist, LiFi chains, theming, toasts, and the main Layout sidebar shell —
      matching the structure used in <code>_app.tsx</code>.
    </Typography>
  </Paper>
);

const meta = {
  title: "EI App/Layouts/RootLayout",
  component: RootLayout,
  parameters: {
    layout: "fullscreen",
    // RootLayout's OryAuthGateway calls `ory.toSession()` on mount; mock a session so
    // children render instead of the login flow.
    nextjs: {
      router: {
        asPath: "/",
        pathname: "/",
      },
    },
    msw: {
      handlers: [oryHandlers.whoamiAuthenticated],
    },
  },
  tags: ["autodocs"],
  args: {
    ...stubAppProps,
    children: (
      <Box>
        <SamplePage />
      </Box>
    ),
  },
} satisfies Meta<typeof RootLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
