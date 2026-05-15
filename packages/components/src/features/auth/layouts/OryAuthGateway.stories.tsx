import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { expect, waitFor, within } from "storybook/test";
import { oryHandlers } from "../../../storybookMocks/oryHandlers";
import { OryAuthGateway } from "./OryAuthGateway";

/**
 * Production wrap from `ei-app` `RootLayout.tsx`: provides `OryGatewayContext`,
 * hydrates session via `ory.toSession()` when `router.asPath` (Pages Router) is not
 * an auth-only route, and renders auth pages on `/ui/login`, `/ui/settings`, etc.
 *
 * With MSW `whoami` returning a session and `parameters.nextjs.router.asPath` set to
 * a non-auth path (e.g. `/`), the **main app `children`** branch should appear after
 * the effect resolves.
 */
const meta = {
  title: "Auth/OryAuthGateway",
  component: OryAuthGateway,
  parameters: {
    layout: "padded",
    // `OryAuthGateway` uses `useRouter()` from `next/router` (Pages Router).
    // Mock it with `parameters.nextjs.router` — not `appDirectory` / `navigation`
    // (those apply to `next/navigation` only).
    nextjs: {
      router: {
        asPath: "/",
      },
    },
    msw: {
      handlers: [oryHandlers.whoamiAuthenticated],
    },
    docs: {
      description: {
        component:
          "Top-level Ory session boundary. Auth routes render when `next/router`'s `asPath` matches a configured auth path; otherwise, after `ory.toSession()` resolves, the main app `children` render. Stories set `parameters.nextjs.router.asPath` (Pages Router mock).",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    changePasswordRoute: "/profile/security",
  },
  render: args => (
    <OryAuthGateway changePasswordRoute={args.changePasswordRoute}>
      <Box
        sx={{ p: 2 }}
        data-testid="ory-gateway-app-shell">
        <Typography
          variant="h6"
          gutterBottom>
          Protected app shell
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          Rendered when session exists and pathname is not one of the configured auth paths (see `OryAuthGateway`
          source).
        </Typography>
      </Box>
    </OryAuthGateway>
  ),
} satisfies Meta<typeof OryAuthGateway>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RendersChildrenWhenSessionLoaded: Story = {
  args: {
    changePasswordRoute: "/profile/security",
    children: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByTestId("ory-gateway-app-shell")).toBeVisible());
    await waitFor(() => expect(canvas.getByText(/protected app shell/i)).toBeVisible());
  },
};
