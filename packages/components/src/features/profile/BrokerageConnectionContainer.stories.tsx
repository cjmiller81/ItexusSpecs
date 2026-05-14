import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { http, HttpResponse } from "msw";
import Box from "@mui/material/Box";
import { BrokerageConnectionContainer } from "./BrokerageConnectionContainer";

// BrokerageConnectionContainer renders the Schwab integration card on
// the Profile / Brokerage tab. It is mostly prop-driven — the parent
// passes `connectedAccounts`, `schwabConnectUrl`, and the four action
// callbacks — but it also:
//   * reads `?isConnected=…` from `useSearchParams()` (next/navigation),
//   * fetches `GET /api/schwab/auth/refreshToken` once the wallet flips
//     into the "connected" branch.
// Both are mocked here through the standard nextjs-vite navigation
// parameter and MSW handler patterns.
const meta = {
  title: "Profile/BrokerageConnectionContainer",
  component: BrokerageConnectionContainer,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/profile/brokerage",
        query: {},
      },
    },
    docs: {
      description: {
        component:
          "Profile / Brokerage card for the Schwab integration. Combines a connect/disconnect toggle, an authorization-expiry readout (driven by `GET /api/schwab/auth/refreshToken`), and a connected-accounts table. Drives `isConnected` from both a `?isConnected=` query param and the `connectedAccounts` array.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    getSchwabAccountList: fn(),
    resetConnectedAccounts: fn(),
    getSchwabConnectUrl: fn(),
    disconnect: fn(),
    schwabConnectUrl: "https://example.test/schwab/oauth",
    connectedAccounts: [],
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, minHeight: "100vh" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof BrokerageConnectionContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const futureRefreshExpiry = new Date("2026-08-15T14:00:00Z").toISOString();

const refreshTokenHandler = http.get("/api/schwab/auth/refreshToken", () =>
  HttpResponse.json({ refreshTokenExpiration: futureRefreshExpiry }),
);

const refreshTokenErrorHandler = http.get("/api/schwab/auth/refreshToken", () =>
  HttpResponse.json({ error: "boom" }, { status: 500 }),
);

// Default — no accounts and no `?isConnected=` query. Shows the
// "Connect to Schwab" CTA on the left and an empty accounts table.
export const NotConnected: Story = {};

// Connected via the `connectedAccounts` prop. The component flips
// `isConnected = true` in a `useEffect` because the list is non-empty,
// which mounts the disconnect/reauthorize controls and triggers the
// `refreshToken` fetch.
export const ConnectedWithAccounts: Story = {
  args: {
    connectedAccounts: [
      { accountNumber: "****1234", status: "Active" },
      { accountNumber: "****5678", status: "Active" },
    ],
  },
  parameters: {
    msw: {
      handlers: [refreshTokenHandler],
    },
  },
};

// `?isConnected=true` mirrors the post-OAuth redirect from Schwab.
// The second `useEffect` reads it from `useSearchParams()`, calls
// `getSchwabAccountList()`, and flips `isConnected` to true even
// though `connectedAccounts` is still empty.
export const ConnectedFromBackend: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/profile/brokerage",
        query: { isConnected: "true" },
      },
    },
    msw: {
      handlers: [refreshTokenHandler],
    },
  },
};

// Same connected branch, but the refreshToken endpoint fails — the
// catch swallows the error and `refreshTokenExpiration` stays null,
// so the "Authorization expires" line renders without a date.
export const RefreshTokenError: Story = {
  args: {
    connectedAccounts: [{ accountNumber: "****9999", status: "Active" }],
  },
  parameters: {
    msw: {
      handlers: [refreshTokenErrorHandler],
    },
  },
};
