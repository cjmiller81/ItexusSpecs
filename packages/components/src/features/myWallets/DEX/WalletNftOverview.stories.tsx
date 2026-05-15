import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import WalletNftOverview from "./WalletNftOverview";
import {
  STORY_DEX_WALLET_ADDRESS,
  storyNoNftWallet,
  storyRichDexWallet,
  walletsStateWithPortfolio,
} from "./walletOverviewStoryData";

const meta: Meta<typeof WalletNftOverview> = {
  title: "MyWallets/DEX/WalletNftOverview",
  component: WalletNftOverview,
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
          "NFT holdings table (thumbnail, collection, network badge, estimated value, portfolio %). Uses `filterValidNFTs` and Redux `portfolioWalletData`.",
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

export const WithNfts: Story = {};

export const NoNfts: Story = {
  parameters: {
    reduxState: {
      wallets: walletsStateWithPortfolio([storyNoNftWallet]),
    },
  },
};
