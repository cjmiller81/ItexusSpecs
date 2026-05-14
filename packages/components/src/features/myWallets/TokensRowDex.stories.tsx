import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import type {
  GridCellParams,
  GridEventListener,
  GridRowId,
  GridRowModesModel,
  GridRowModel,
  GridRowSelectionModel,
  MuiEvent,
} from "@mui/x-data-grid";
import { GridRowEditStopReasons, GridRowModes, useGridApiRef } from "@mui/x-data-grid";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import type { Wallet } from "../../models";
import { ExpandableRowDex } from "./TokensRowDex";
import { DexWalletsTable } from "./DexWalletTable";
import { getDexWalletsColumns } from "./DexWalletsTableColumnsDefs";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { STORY_DEX_WALLET_ADDRESS, storyRichDexWallet, walletsStateWithPortfolio } from "./DEX/walletOverviewStoryData";

const dexWalletRows: Wallet[] = [
  {
    walletId: "story-dex-1",
    address: STORY_DEX_WALLET_ADDRESS,
    walletName: "Overview demo",
    isValid: true,
    isPersonal: true,
    chainAssets: [],
  },
];

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

function TokensRowDexGridDemo({ startExpanded }: { startExpanded: boolean }) {
  const theme = useTheme();
  const isXL = useMediaQuery("(min-width:2000px)");
  const apiRef = useGridApiRef();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [expandedRows, setExpandedRows] = useState<GridRowId[]>(() =>
    startExpanded ? [STORY_DEX_WALLET_ADDRESS] : [],
  );
  const [expandedRowHeights, setExpandedRowHeights] = useState<Record<string, string>>({});

  useEffect(() => {
    setExpandedRows(startExpanded ? [STORY_DEX_WALLET_ADDRESS] : []);
  }, [startExpanded]);

  const orderedWallets = useMemo(() => {
    if (expandedRows.length === 0) return dexWalletRows;
    const expandedRowId = expandedRows[0];
    const expandedWallet = dexWalletRows.find(w => w.address === expandedRowId);
    if (!expandedWallet) return dexWalletRows;
    const otherWallets = dexWalletRows.filter(w => w.address !== expandedRowId);
    return [...otherWallets, expandedWallet];
  }, [expandedRows]);

  const updateRowHeight = useCallback((rowId: string, height: string) => {
    setExpandedRowHeights(prev => ({ ...prev, [rowId]: height }));
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel(m => ({ ...m, [id]: { mode: GridRowModes.Edit } }));
  };

  const handleExpandClick = (id: GridRowId, expanded: boolean) => {
    setExpandedRows(expanded ? [id as string] : []);
  };

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel(m => ({ ...m, [id]: { mode: GridRowModes.View } }));
  };

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel(m => ({
      ...m,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const handleDeleteClick = (_id: GridRowId) => {};

  const processRowUpdate = (newRow: GridRowModel<Wallet>) => {
    return { ...newRow, isNew: false };
  };

  const onCellClick = async (params: GridCellParams, event: MuiEvent<MouseEvent>) => {
    const stopPropagation = ["expand", "actions", "address", "walletName", "isPersonal"];
    if (stopPropagation.includes(params.field)) {
      event.stopPropagation();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 960,
        height: startExpanded ? 720 : 280,
        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        p: 2,
      }}>
      <DexWalletsTable
        apiRef={apiRef}
        loading={false}
        disableVirtualization
        hideFooter
        $hasExpandedRows={expandedRows.length > 0}
        $minHeight={expandedRows.length > 0 ? expandedRowHeights[expandedRows[0] as string] || "55vh" : undefined}
        sx={{ ...tableScrollSx, height: "100%", minHeight: startExpanded ? 640 : 220 }}
        scrollbarSize={7}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slotProps={{
          row: {
            isExpanded: (id: GridRowId) => expandedRows.includes(id),
            onHeightUpdate: updateRowHeight,
            isCollapsed: false,
          },
        }}
        slots={{ row: ExpandableRowDex }}
        onRowSelectionModelChange={(_rowSelectionModel: GridRowSelectionModel) => {}}
        onCellClick={onCellClick}
        getRowId={x => x.address}
        columns={getDexWalletsColumns({
          handleCancelClick,
          handleSaveClick,
          handleEditClick,
          handleDeleteClick,
          gridRowModesModel: rowModesModel,
          expandedRows,
          onExpandClick: handleExpandClick,
          isXL,
        })}
        rows={orderedWallets}
        rowSelectionModel={[]}
        checkboxSelection={true}
      />
    </Box>
  );
}

const meta: Meta<typeof TokensRowDexGridDemo> = {
  title: "MyWallets/TokensRowDex",
  component: TokensRowDexGridDemo,
  parameters: {
    layout: "padded",
    reduxState: {
      wallets: walletsStateWithPortfolio([storyRichDexWallet]),
    },
    docs: {
      description: {
        component:
          "`ExpandableRowDex` — DEX wallet row with sticky expanded chrome; nested `WalletTokensOverview`, `WalletDeFiOverview`, and `WalletNftOverview`. Data from Redux `portfolioWalletData` for `row.address`.",
      },
    },
  },
  tags: ["autodocs"],
  args: { startExpanded: true },
  render: args => <TokensRowDexGridDemo startExpanded={args.startExpanded} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: { startExpanded: true },
};

export const Collapsed: Story = {
  args: { startExpanded: false },
};
