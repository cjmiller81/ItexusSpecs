import { Box, BoxProps, Button, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import {
  GridCellParams,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowSelectionModel,
  MuiEvent,
  useGridApiRef,
} from "@mui/x-data-grid";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageTitle } from "../../components/TextDisplay/PageTitle";
import { Wallet } from "../../models";
import { TotalWalletWorthData } from "../../slices";
import { ExpandableRow } from "./TokensRow";
import { TotalWalletsWorthCard } from "./TotalWalletsWorthCard";
import { AddressModel, WalletInputModal } from "./WalletInputModal";
import { StyledWalletsTable } from "./WalletsTable";
import { getWalletsColumns } from "./WalletsTableColumnsDefs";
import SimpleBar from "simplebar-react";

interface Props extends BoxProps {
  wallets: Wallet[];
  selectedWalletsIds: string[];
  loading?: boolean;
  //eslint-disable-next-line no-unused-vars
  onUpdateWallet: (wallet: Wallet) => void;
  //eslint-disable-next-line no-unused-vars
  onDeleteWallet: (wallet: string) => void;
  //eslint-disable-next-line no-unused-vars
  onAddWallet: (wallet: AddressModel) => void;
  //eslint-disable-next-line no-unused-vars
  onSelectedRowsChanged?: (rows: Wallet[]) => void;
  totalWalletsWorthData?: TotalWalletWorthData;
}

export const MyWalletsSection = ({
  onAddWallet,
  onDeleteWallet,
  onSelectedRowsChanged,
  onUpdateWallet,
  wallets,
  totalWalletsWorthData,
  loading,
  selectedWalletsIds,
  sx,
  ...props
}: Props) => {
  const { t } = useTranslation("MyWalletsSection");
  const apiRef = useGridApiRef();
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [expandedRows, setExpandedRows] = useState<GridRowId[]>([]);
  const addWallet = async (walletAddressModel: AddressModel) => {
    onAddWallet(walletAddressModel);
    setAddWalletModalOpen(false);
  };

  const onSelectedChanged = (rows: Wallet[]) => {
    if (onSelectedRowsChanged) onSelectedRowsChanged(rows);
  };

  //eslint-disable-next-line no-undef
  const onCellClick = async (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    const stopPropagation = ["expand", "trash", "address", "name"];
    if (stopPropagation.includes(params.field)) {
      event.stopPropagation();
    }
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleExpandClick = (id: GridRowId, expanded: boolean) => {
    const newExpanded = expanded ? [...expandedRows, id as string] : expandedRows.filter(rowId => rowId !== id);
    setExpandedRows(newExpanded);
  };

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleDeleteClick = (id: GridRowId) => {
    onDeleteWallet(id as string);
  };

  const processRowUpdate = (newRow: GridRowModel<Wallet>, _oldRow: GridRowModel<Wallet>) => {
    //TODO add validation
    const updatedRow = { ...newRow, isNew: false };
    onUpdateWallet(newRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box
      {...props}
      sx={{ ...sx, position: "relative" }}>
      {addWalletModalOpen && (
        <WalletInputModal
          open={addWalletModalOpen}
          onEnter={addWallet}
          onClose={() => setAddWalletModalOpen(false)}
        />
      )}
      <StyledWalletWorthContainer>
        <TotalWalletsWorthCard
          growPercentage={totalWalletsWorthData?.growPercentage ?? 0}
          totalWorth={totalWalletsWorthData?.totalWorth ?? 0}
        />
      </StyledWalletWorthContainer>
      <StyledAdaptivePageBox>
        <StyledAddWalletButton
          variant="contained"
          onClick={() => setAddWalletModalOpen(true)}>
          {t("AddWallet")}
        </StyledAddWalletButton>
      </StyledAdaptivePageBox>
      <StyledAdaptivePageBox>
        <PageTitle sx={{ mt: 4 }}>{t("Wallets")}</PageTitle>
      </StyledAdaptivePageBox>

      <SimpleBar style={{ maxHeight: "600px" }}>
        <StyledWalletsTable
          loading={loading}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slotProps={{
            row: {
              isExpanded: (id: GridRowId) => expandedRows.includes(id),
            },
          }}
          slots={{
            row: ExpandableRow,
          }}
          onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) => {
            onSelectedChanged(
              wallets.filter(wallet => rowSelectionModel.some(rowSelection => wallet.address === rowSelection)),
            );
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          onCellClick={onCellClick}
          apiRef={apiRef}
          getRowId={x => x.address}
          columns={getWalletsColumns({
            handleCancelClick: handleCancelClick,
            handleSaveClick: handleSaveClick,
            handleEditClick: handleEditClick,
            handleDeleteClick: handleDeleteClick,
            gridRowModesModel: rowModesModel,
            expandedRows: expandedRows,
            onExpandClick: handleExpandClick,
          })}
          rows={wallets}
          rowSelectionModel={selectedWalletsIds}
        />
      </SimpleBar>
    </Box>
  );
};

export const StyledWalletWorthContainer: any = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  [theme.breakpoints.down("md")]: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    right: 0,
    top: 0,
    mt: 4,
  },
}));

export const StyledAdaptivePageBox: any = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const StyledAddWalletButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(4),
  },
}));
