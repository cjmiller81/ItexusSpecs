import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import {
  deleteExchange,
  deleteWallet,
  selectWallets,
  updateWallet,
  useAppDispatch,
  useAppSelector,
} from "../../slices";
import { MyWalletsSection } from "./MyWalletsSection";
import { storyBillingProDexAccess, storyWalletsStateForSection } from "../../storybookMocks/myWalletsSectionStoryData";

function MyWalletsSectionRedux() {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector(state => state.wallets.wallets);
  const exchanges = useAppSelector(state => state.wallets.exchanges);
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
    <MyWalletsSection
      wallets={wallets}
      exchanges={exchanges}
      selectedWalletsIds={selectedWallets.map(w => w.address)}
      loading={statusFetchingWallets === "loading"}
      onUpdateWallet={w => {
        void dispatch(updateWallet(w));
      }}
      onDeleteWallet={id => {
        void dispatch(deleteWallet(id));
      }}
      onDeleteExchange={id => {
        void dispatch(deleteExchange(id));
      }}
      onAddWallet={() => {}}
      onSelectedRowsChanged={rows => {
        void dispatch(selectWallets(rows));
      }}
      totalWalletsWorthData={totalWalletsWorthData}
      totalAmount={totalAmount}
    />
  );
}

const meta = {
  title: "MyWallets/MyWalletsSection",
  component: MyWalletsSectionRedux,
  parameters: {
    layout: "padded",
    reduxState: {
      billing: storyBillingProDexAccess,
      wallets: storyWalletsStateForSection(),
    },
    docs: {
      description: {
        component:
          "Profile-style Web3 wallets block: add-wallet guard, `PageTitle`, and `DexWalletsTable` with `ExpandableRowDex`. Wallets, selection, and portfolio data come from the wallets slice (see `WalletsContainer`).",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 1100, minHeight: 640 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof MyWalletsSectionRedux>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    reduxState: {
      billing: storyBillingProDexAccess,
      wallets: storyWalletsStateForSection({
        wallets: null,
        statusFetchingWallets: "loading",
        selectedWallets: [],
      }),
    },
  },
};

export const Empty: Story = {
  parameters: {
    reduxState: {
      billing: storyBillingProDexAccess,
      wallets: storyWalletsStateForSection({
        wallets: [],
        selectedWallets: [],
        portfolioWalletData: [],
      }),
    },
  },
};
