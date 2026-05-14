import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import WalletDeFiOverview from "./WalletDeFiOverview";
import {
  STORY_DEX_WALLET_ADDRESS,
  storyNoDefiWallet,
  storyRichDexWallet,
  walletsStateWithPortfolio,
} from "./walletOverviewStoryData";

const meta: Meta<typeof WalletDeFiOverview> = {
  title: "MyWallets/DEX/WalletDeFiOverview",
  component: WalletDeFiOverview,
  args: {
    walletAddress: STORY_DEX_WALLET_ADDRESS,
  },
  parameters: {
    layout: "padded",
    reduxState: {
      wallets: walletsStateWithPortfolio([storyRichDexWallet]),
    },
    docs: {
      description: {
        component:
          "DeFi positions grouped by protocol (collapsible sections, supplied / claimable / value, portfolio progress). Data from Redux `portfolioWalletData`.",
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

export const WithPositions: Story = {};

export const NoPositions: Story = {
  parameters: {
    reduxState: {
      wallets: walletsStateWithPortfolio([storyNoDefiWallet]),
    },
  },
};
