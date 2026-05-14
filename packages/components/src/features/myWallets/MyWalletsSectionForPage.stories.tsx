import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { deleteWallet, selectWallets, updateWallet, useAppDispatch, useAppSelector } from "../../slices";
import { MyWalletsSectionForPage } from "./MyWalletsSectionForPage";
import { storyBillingProDexAccess, storyWalletsStateForSection } from "../../storybookMocks/myWalletsSectionStoryData";

function MyWalletsSectionForPageRedux() {
  const dispatch = useAppDispatch();
  const [addWalletModalOpen, setAddWalletModalOpen] = useState(false);
  const wallets = useAppSelector(state => state.wallets.wallets);
  const statusFetchingWallets = useAppSelector(state => state.wallets.statusFetchingWallets);
  const selectedWallets = useAppSelector(state => state.wallets.selectedWallets);
  const portfolioWalletData = useAppSelector(state => state.wallets.portfolioWalletData);
  const totalWalletsWorthData = useAppSelector(state => state.wallets.totalWalletsWorthData);

  const totalAmount = useMemo(() => {
    if (!selectedWallets.length || !portfolioWalletData.length) {
      return 0;
    }
    return selectedWallets.reduce((sum, w) => {
      const p = portfolioWalletData.find(x => x.walletAddress === w.address);
      return sum + (p?.totalValueUSD ?? 0);
    }, 0);
  }, [selectedWallets, portfolioWalletData]);

  return (
    <MyWalletsSectionForPage
      addWalletModalOpen={addWalletModalOpen}
      setAddWalletModalOpen={setAddWalletModalOpen}
      wallets={wallets}
      selectedWalletsIds={selectedWallets.map(w => w.address)}
      loading={statusFetchingWallets === "loading"}
      onUpdateWallet={w => {
        void dispatch(updateWallet(w));
      }}
      onDeleteWallet={id => {
        void dispatch(deleteWallet(id));
      }}
      onSelectedRowsChanged={rows => {
        void dispatch(selectWallets(rows));
      }}
      totalWalletsWorthData={totalWalletsWorthData}
      totalAmount={totalAmount}
    />
  );
}

const meta = {
  title: "MyWallets/MyWalletsSectionForPage",
  component: MyWalletsSectionForPageRedux,
  parameters: {
    layout: "padded",
    reduxState: {
      billing: storyBillingProDexAccess,
      wallets: storyWalletsStateForSection(),
    },
    docs: {
      description: {
        component:
          "My Wallets on the full page: card with Positions / Transaction History tabs, expand control, and DEX grid with expandable overview rows. Wires the wallets Redux slice like production.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 1100, minHeight: 720 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof MyWalletsSectionForPageRedux>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
