import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import type { Wallet } from "../../models";
import { ExpandableRow } from "./TokensRow";
import { STORY_DEX_WALLET_ADDRESS, storyRichDexWallet, walletsStateWithPortfolio } from "./DEX/walletOverviewStoryData";

const columns: GridColDef<Wallet>[] = [
  { field: "walletName", headerName: "Label", flex: 0.45, minWidth: 120 },
  { field: "address", headerName: "Address", flex: 1, minWidth: 220 },
];

const walletRows: Wallet[] = [
  {
    walletId: "story-w1",
    address: STORY_DEX_WALLET_ADDRESS,
    walletName: "Expanded demo",
    isValid: true,
    isPersonal: true,
    chainAssets: [],
  },
];

function TokensRowGridDemo({ startExpanded }: { startExpanded: boolean }) {
  const expandedRows: GridRowId[] = startExpanded ? [STORY_DEX_WALLET_ADDRESS] : [];
  const isExpanded = (id: GridRowId) => expandedRows.includes(id);

  return (
    <Box sx={{ width: "100%", maxWidth: 840, height: startExpanded ? 520 : 220 }}>
      <DataGrid
        rows={walletRows}
        columns={columns}
        getRowId={r => r.address}
        hideFooter
        disableRowSelectionOnClick
        disableVirtualization
        getRowHeight={() => "auto"}
        slots={{ row: ExpandableRow }}
        slotProps={{
          row: {
            isExpanded,
          } as Record<string, unknown>,
        }}
      />
    </Box>
  );
}

const meta: Meta<typeof TokensRowGridDemo> = {
  title: "MyWallets/TokensRow",
  component: TokensRowGridDemo,
  parameters: {
    layout: "padded",
    reduxState: {
      wallets: walletsStateWithPortfolio([storyRichDexWallet]),
    },
    docs: {
      description: {
        component:
          "`ExpandableRow` — main grid row plus nested token `BasicTable` when expanded. Loads token rows from Redux `portfolioWalletData` for `row.address`.",
      },
    },
  },
  tags: ["autodocs"],
  args: { startExpanded: true },
  render: args => <TokensRowGridDemo startExpanded={args.startExpanded} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: { startExpanded: true },
};

export const Collapsed: Story = {
  args: { startExpanded: false },
};
