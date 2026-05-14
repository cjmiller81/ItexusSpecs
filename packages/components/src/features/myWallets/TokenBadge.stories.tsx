import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { TokenTransfer } from "../../types/transactions";
import { TokenBadge } from "./TokenBadge";
import "./TransactionHistory.css";

const transferIn: TokenTransfer = {
  symbol: "ETH",
  name: "Ether",
  amount: 0.452,
  direction: "in",
  logoUrl: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/eth.svg",
  usdValue: 1200.5,
  contractAddress: "0x0000000000000000000000000000000000000000",
};

const transferOutNoLogo: TokenTransfer = {
  symbol: "USDC",
  name: "USD Coin",
  amount: 250,
  direction: "out",
  logoUrl: null,
  usdValue: 250,
  contractAddress: "0x0b2c639c533813ac4c66259d21f6bdeb7e9bebc4",
};

const meta = {
  title: "MyWallets/TokenBadge",
  component: TokenBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Inline token amount row for the transaction history table. Styling is scoped under `.transaction-history .token-badge` in `TransactionHistory.css`, so each story wraps the badge in that container.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box
        className="transaction-history"
        sx={{ p: 3, bgcolor: "background.paper", borderRadius: 1 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof TokenBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IncomingWithLogo: Story = {
  args: { transfer: transferIn },
};

export const OutgoingFallbackInitials: Story = {
  args: { transfer: transferOutNoLogo },
};

export const RowOfBadges: Story = {
  args: { transfer: transferIn },
  render: () => (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      useFlexGap>
      <TokenBadge transfer={transferIn} />
      <TokenBadge transfer={transferOutNoLogo} />
    </Stack>
  ),
};
