import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import WalletTokensOverview from "./WalletTokensOverview";
import {
  STORY_DEX_WALLET_ADDRESS,
  storyEmptyTokensWallet,
  storyRichDexWallet,
  walletsStateWithPortfolio,
} from "./walletOverviewStoryData";

const meta: Meta<typeof WalletTokensOverview> = {
  title: "MyWallets/DEX/WalletTokensOverview",
  component: WalletTokensOverview,
  args: {
    walletAddress: STORY_DEX_WALLET_ADDRESS,
    showDust: false,
  },
  parameters: {
    layout: "padded",
    reduxState: {
      wallets: walletsStateWithPortfolio([storyRichDexWallet]),
    },
    docs: {
      description: {
        component:
          "Token holdings table for a DEX wallet (ChainChip, balances, USD value, portfolio %). Reads `portfolioWalletData` from the wallets slice.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 960 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTokens: Story = {};

export const EmptyTokenRows: Story = {
  parameters: {
    reduxState: {
      wallets: walletsStateWithPortfolio([storyEmptyTokensWallet]),
    },
  },
};

export const UnknownWalletAddress: Story = {
  args: {
    walletAddress: "0x0000000000000000000000000000000000000999",
  },
};
