import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { http, HttpResponse } from "msw";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TransactionSyncButton } from "./TransactionSyncButton";
import "./TransactionHistory.css";

const WALLET_ADDRESS = "0xabc0000000000000000000000000000000000def";
const chainIso = new Date("2026-05-12T20:00:00Z").toISOString();

const meta = {
  title: "MyWallets/TransactionSyncButton",
  component: TransactionSyncButton,
  args: {
    walletAddress: WALLET_ADDRESS,
    onSyncComplete: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Starts `POST /api/wallet/:address/sync`, fans out `walletSyncStatusUpdated` events, then polls `GET …/sync-status` every 15s until every chain reports `sync_in_progress: false`. Successful runs toast at the top center and begin a 10-minute localStorage-backed cooldown (`syncCooldownEnd`).",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => {
      localStorage.removeItem("syncCooldownEnd");
      return (
        <>
          <ToastContainer position="top-center" />
          <Box sx={{ p: 4 }}>
            <Story />
          </Box>
        </>
      );
    },
  ],
} satisfies Meta<typeof TransactionSyncButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(`/api/wallet/${WALLET_ADDRESS}/sync`, () =>
          HttpResponse.json({
            chains: [{ chain_name: "eth-mainnet", last_synced_at: chainIso, sync_in_progress: true }],
          }),
        ),
        http.get(`/api/wallet/${WALLET_ADDRESS}/sync-status`, () =>
          HttpResponse.json({
            chains: [{ chain_name: "eth-mainnet", last_synced_at: chainIso, sync_in_progress: false }],
          }),
        ),
      ],
    },
  },
};

export const PostFails: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(`/api/wallet/${WALLET_ADDRESS}/sync`, () => HttpResponse.json({ error: "nope" }, { status: 500 })),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /sync new transactions/i }));
    await waitFor(() => canvas.getByText(/sync failed/i));
  },
};

export const NoWalletSelected: Story = {
  args: { walletAddress: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /sync new transactions/i }));
    await waitFor(() => canvas.getByText(/no wallet selected/i));
  },
};

export const CooldownFromStorage: Story = {
  decorators: [
    Story => {
      localStorage.setItem("syncCooldownEnd", String(Date.now() + 10 * 60 * 1000));
      return <Story />;
    },
  ],
};

export const CompletesAfterPoll: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(`/api/wallet/${WALLET_ADDRESS}/sync`, () =>
          HttpResponse.json({
            chains: [{ chain_name: "eth-mainnet", last_synced_at: chainIso, sync_in_progress: true }],
          }),
        ),
        http.get(`/api/wallet/${WALLET_ADDRESS}/sync-status`, () =>
          HttpResponse.json({
            chains: [{ chain_name: "eth-mainnet", last_synced_at: chainIso, sync_in_progress: false }],
          }),
        ),
      ],
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: /sync new transactions/i }));
    await waitFor(() => expect(canvas.getByRole("button", { name: /sync new transactions/i })).toBeDisabled(), {
      timeout: 2000,
    });
    await waitFor(() => body.getByText("Sync completed!"), { timeout: 18_000 });
    await expect(args.onSyncComplete).toHaveBeenCalled();
  },
};
