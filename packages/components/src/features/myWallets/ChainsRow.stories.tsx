import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { ExpandableChainRow } from "./ChainsRow";
import { krakenStoryHandlers } from "../../storybookMocks/krakenHandlers";

interface KrakenAccountRow {
  id: string;
  accountLabel: string;
}

const columns: GridColDef<KrakenAccountRow>[] = [
  { field: "accountLabel", headerName: "Account", flex: 1, minWidth: 200 },
];

const rows: KrakenAccountRow[] = [{ id: "kraken-1", accountLabel: "Kraken — spot balances" }];

function ChainsRowGridDemo({ startExpanded }: { startExpanded: boolean }) {
  const expandedRows: GridRowId[] = startExpanded ? ["kraken-1"] : [];
  const isExpanded = (id: GridRowId) => expandedRows.includes(id);

  return (
    <Box sx={{ width: "100%", maxWidth: 640, height: startExpanded ? 400 : 200 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={r => r.id}
        hideFooter
        disableRowSelectionOnClick
        disableVirtualization
        getRowHeight={() => "auto"}
        slots={{ row: ExpandableChainRow }}
        slotProps={{
          row: {
            isExpanded,
          } as Record<string, unknown>,
        }}
      />
    </Box>
  );
}

const meta: Meta<typeof ChainsRowGridDemo> = {
  title: "MyWallets/ChainsRow",
  component: ChainsRowGridDemo,
  parameters: {
    layout: "padded",
    msw: {
      handlers: [...krakenStoryHandlers()],
    },
    docs: {
      description: {
        component:
          "`ExpandableChainRow` — Kraken account row with expandable per-asset balance table (`krakenApi.getAccountBalance`). Mocked via MSW in Storybook.",
      },
    },
  },
  tags: ["autodocs"],
  args: { startExpanded: true },
  render: args => <ChainsRowGridDemo startExpanded={args.startExpanded} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: { startExpanded: true },
};

export const Collapsed: Story = {
  args: { startExpanded: false },
};
