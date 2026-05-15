import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse, delay } from "msw";
import { within, waitFor } from "storybook/test";
import Box from "@mui/material/Box";
import { TransactionSyncStatus } from "./TransactionSyncStatus";
import "./TransactionHistory.css";

const WALLET_ADDRESS = "0xabc0000000000000000000000000000000000def";

// TransactionSyncStatus is the "Last synced …" pill that sits beside
// the wallet selector. It calls `GET /api/wallet/:address/sync-status`
// on mount, reads the first chain's `last_synced_at`, and also listens
// for a global `walletSyncStatusUpdated` custom event so the
// TransactionSyncButton can stream live progress into it.
//
// CSS comes from the colocated `TransactionHistory.css` (the `.sync-pill`
// rules are global), which the story imports directly.
const meta = {
  title: "MyWallets/TransactionSyncStatus",
  component: TransactionSyncStatus,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Read-only pill that surfaces the per-wallet sync status. Renders three states: a synced timestamp, an unknown/unavailable fallback, and a transient `<n> of <m> chains synced` message driven by the global `walletSyncStatusUpdated` CustomEvent.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    walletAddress: WALLET_ADDRESS,
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, display: "inline-block" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof TransactionSyncStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

const recentSyncIso = new Date("2026-05-12T18:30:00Z").toISOString();

export const Synced: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/wallet/:address/sync-status", () =>
          HttpResponse.json({
            chains: [
              { chain_name: "eth-mainnet", last_synced_at: recentSyncIso, sync_in_progress: false },
              { chain_name: "base-mainnet", last_synced_at: recentSyncIso, sync_in_progress: false },
            ],
          }),
        ),
      ],
    },
  },
};

// Empty `chains` array — implementation routes that through the
// `raw == null` branch and renders the "unavailable" fallback.
export const Unavailable: Story = {
  parameters: {
    msw: {
      handlers: [http.get("/api/wallet/:address/sync-status", () => HttpResponse.json({ chains: [] }))],
    },
  },
};

// Hold the response forever so the initial "Loading…" label stays
// visible while the request is in flight.
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/wallet/:address/sync-status", async () => {
          await delay("infinite");
          return HttpResponse.json({ chains: [] });
        }),
      ],
    },
  },
};

// Network error — axios rejects, the catch falls back to "unavailable".
export const ApiError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/wallet/:address/sync-status", () => HttpResponse.json({ error: "boom" }, { status: 500 })),
      ],
    },
  },
};

// Dispatches the same `walletSyncStatusUpdated` CustomEvent that
// TransactionSyncButton fires while a sync is running. The component
// listens on `window` and rewrites the pill to "<synced> of <total>".
export const ProgressEvent: Story = {
  parameters: {
    msw: {
      handlers: [http.get("/api/wallet/:address/sync-status", () => HttpResponse.json({ chains: [] }))],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByText("Sync status unavailable"));
    window.dispatchEvent(
      new CustomEvent("walletSyncStatusUpdated", {
        detail: { walletAddress: WALLET_ADDRESS, syncedChains: 3, totalChains: 5 },
      }),
    );
    await waitFor(() => canvas.getByText("3 of 5 chains synced"));
  },
};
