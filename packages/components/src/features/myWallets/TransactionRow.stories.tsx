import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { SpamInfo, TokenTransfer, Transaction } from "../../types/transactions";
import { TransactionRow } from "./TransactionRow";
import "./TransactionHistory.css";

const emptySpam: SpamInfo = { isSpam: false, score: 0, reasons: [] };
const spamInfo: SpamInfo = { isSpam: true, score: 0.92, reasons: ["Token age", "Low liquidity"] };

const tokenIn: TokenTransfer = {
  symbol: "USDC",
  name: "USD Coin",
  amount: 5000,
  direction: "in",
  logoUrl: null,
  usdValue: 5000,
  contractAddress: "0x0b2c639c533813ac4c66259d21f6bdeb7e9bebc4",
};

const tokenOut: TokenTransfer = {
  symbol: "ETH",
  name: "Ether",
  amount: 1.2,
  direction: "out",
  logoUrl: null,
  usdValue: 3840,
  contractAddress: "0x0000000000000000000000000000000000000000",
};

const txBase = {
  hash: "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3",
  chainId: 1,
  chainName: "eth-mainnet",
  blockNumber: 18_000_000,
  timestamp: "2026-05-10T12:00:00.000Z",
  protocol: null as string | null,
  success: true,
  fromAddress: "0x1111111111111111111111111111111111111111",
  toAddress: "0x2222222222222222222222222222222222222222",
  gasUsed: 210_000,
  gasUsd: 2.15,
  spam: emptySpam,
  explorerUrl: "https://etherscan.io/tx/0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3",
};

const borderColors = { borderColor: "rgba(148, 163, 184, 0.22)" };

const swapTransaction: Transaction = {
  ...txBase,
  type: "swap",
  transfers: [tokenIn, tokenOut],
};

const approvalTransaction: Transaction = {
  ...txBase,
  type: "approval",
  transfers: [],
};

const spamSwapTransaction: Transaction = {
  ...swapTransaction,
  spam: spamInfo,
};

const meta = {
  title: "MyWallets/TransactionRow",
  component: TransactionRow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Single transaction row for `TransactionHistory.css` — type badge, chain, gas, explorer link, and `TokenBadge` flows. Wrapped in `.transaction-history` so scoped CSS applies.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    transaction: swapTransaction,
    borderColors,
  },
  decorators: [
    Story => (
      <div
        className="transaction-history"
        style={{ maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransactionRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Swap: Story = {};

export const ApprovalNoTransfers: Story = {
  args: { transaction: approvalTransaction },
};

export const MarkedSpam: Story = {
  args: { transaction: spamSwapTransaction },
};
