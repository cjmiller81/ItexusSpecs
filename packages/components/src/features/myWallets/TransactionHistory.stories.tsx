import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  STORY_TRANSACTION_WALLET,
  transactionHistoryEmptyHandlers,
  transactionHistoryErrorHandlers,
} from "../../storybookMocks/transactionHistoryHandlers";
import type { Wallet } from "../../models";
import { TransactionHistory } from "./TransactionHistory";
import "./TransactionHistory.css";

const demoWallets: Wallet[] = [
  {
    address: STORY_TRANSACTION_WALLET,
    walletId: "story-wallet-1",
    walletName: "Story demo wallet",
    isValid: true,
    isPersonal: true,
    chainAssets: [],
  },
];

const meta: Meta<typeof TransactionHistory> = {
  title: "MyWallets/TransactionHistory",
  component: TransactionHistory,
  args: {
    walletAddress: STORY_TRANSACTION_WALLET,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full transaction panel: wallet selector, sync controls, filters, paginated list (`useTransactionHistory` + MSW). Wallet routes are mocked globally in `preview.tsx` + `transactionHistoryHandlers`; override with `EmptyFiltered` / `ApiError`. Requires `TransactionHistory.css`.",
      },
    },
  },
  decorators: [
    Story => {
      localStorage.removeItem("syncCooldownEnd");
      return (
        <>
          <ToastContainer position="top-center" />
          <Box sx={{ p: 2, maxWidth: 1100, mx: "auto" }}>
            <Story />
          </Box>
        </>
      );
    },
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTransactions: Story = {};

export const EmptyFiltered: Story = {
  parameters: {
    msw: {
      handlers: [...transactionHistoryEmptyHandlers()],
    },
  },
};

export const ApiError: Story = {
  parameters: {
    msw: {
      handlers: [...transactionHistoryErrorHandlers()],
    },
  },
};

export const PickWalletFromList: Story = {
  args: {
    walletAddress: undefined,
    wallets: demoWallets,
  },
};
