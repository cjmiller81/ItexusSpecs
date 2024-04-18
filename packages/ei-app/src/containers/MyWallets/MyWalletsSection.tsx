import PageTitle from "@/components/TextDisplay/PageTitle"
import { getWalletsColumns } from "@/constants/ColumnsDefs/WalletsTable"
import { ExpandableRow } from "@/containers/MyWallets/TokensRow"
import { TotalWalletsWorthCard } from "@/containers/MyWallets/TotalWalletsWorthCard"
import { StyledWalletsTable } from "@/containers/MyWallets/WalletsTable"
import { TotalWalletWorthData } from "@/libs/redux/Slices/WalletsSlice"
import { Wallet } from "@/models/Wallet/Wallet"
import { Box, BoxProps, Button } from "@mui/material"
import { styled } from "@mui/system"
import {
  GridCellParams,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowSelectionModel,
  GridRowsProp,
  MuiEvent,
  useGridApiRef,
} from "@mui/x-data-grid"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { AddressModel, WalletInputModal } from "../../components/Modals/WalletInputModal"

interface Props extends BoxProps {
  wallets: Wallet[]
  selectedWalletsIds: string[]
  loading?: boolean
  //eslint-disable-next-line no-unused-vars
  onUpdateWallet: (wallet: Wallet) => void
  //eslint-disable-next-line no-unused-vars
  onDeleteWallet: (wallet: string) => void
  //eslint-disable-next-line no-unused-vars
  onAddWallet: (wallet: AddressModel) => void
  //eslint-disable-next-line no-unused-vars
  onSelectedRowsChanged?: (rows: Wallet[]) => void
  totalWalletsWorthData?: TotalWalletWorthData
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
  const { t } = useTranslation("MyWalletsSection")
  const apiRef = useGridApiRef()
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false)
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [expandedRows, setExpandedRows] = useState<GridRowId[]>([])
  const addWallet = async (walletAddressModel: AddressModel) => {
    onAddWallet(walletAddressModel)
    setAddWalletModalOpen(false)
  }

  const onSelectedChanged = (rows: Wallet[]) => {
    if (onSelectedRowsChanged) onSelectedRowsChanged(rows)
  }

  //eslint-disable-next-line no-undef
  const onCellClick = async (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    const stopPropagation = ["expand", "trash", "address", "name"]
    if (stopPropagation.includes(params.field)) {
      event.stopPropagation()
    }
  }

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleExpandClick = (id: GridRowId, expanded: boolean) => {
    const newExpanded = expanded ? [...expandedRows, id as string] : expandedRows.filter(rowId => rowId !== id)
    setExpandedRows(newExpanded)
  }

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })
  }

  const handleDeleteClick = (id: GridRowId) => {
    onDeleteWallet(id as string)
  }

  const processRowUpdate = (newRow: GridRowModel<Wallet>, oldRow: GridRowModel<Wallet>) => {
    //TODO add validation
    const updatedRow = { ...newRow, isNew: false }
    onUpdateWallet(newRow)
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

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
          )
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
    </Box>
  )
}

export const StyledWalletWorthContainer = styled(Box)(({ theme }) => ({
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
}))

export const StyledAdaptivePageBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}))

export const StyledAddWalletButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(4),
  },
}))
