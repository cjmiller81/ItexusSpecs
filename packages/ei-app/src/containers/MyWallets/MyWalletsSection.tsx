import PageTitle from "@/components/TextDisplay/PageTitle"
import { getWalletsColumns } from "@/constants/ColumnsDefs/WalletsTable"
import { ExpandableRow } from "@/containers/MyWallets/TokensRow"
import { TotalWalletsWorthCard } from "@/containers/MyWallets/TotalWalletsWorthCard"
import { StyledWalletsTable } from "@/containers/MyWallets/WalletsTable"
import { TotalWalletWorthData } from "@/libs/redux/Slices/WalletsSlice"
import { Wallet } from "@/models/Wallet/Wallet"
import { Box, BoxProps, Button } from "@mui/material"
import { styled } from "@mui/system"
import { GridCellParams, GridRowSelectionModel, MuiEvent, useGridApiRef } from "@mui/x-data-grid"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { AddressModel, WalletInputModal } from "../../components/Modals/WalletInputModal"

interface Props extends BoxProps {
  wallets: WalletRow[]
  selectedWalletsIds: string[]
  loading?: boolean
  //eslint-disable-next-line no-unused-vars
  onDeleteWallet: (wallet: string) => void
  //eslint-disable-next-line no-unused-vars
  onAddWallet: (wallet: AddressModel) => void
  //eslint-disable-next-line no-unused-vars
  onSelectedRowsChanged?: (rows: WalletRow[]) => void
  totalWalletsWorthData?: TotalWalletWorthData
}

export type WalletRow = Wallet & { expanded: boolean }

export const MyWalletsSection = ({
  onAddWallet,
  onDeleteWallet,
  onSelectedRowsChanged,
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

  const addWallet = async (walletAddressModel: AddressModel) => {
    onAddWallet(walletAddressModel)
    setAddWalletModalOpen(false)
  }

  const onSelectedChanged = (rows: WalletRow[]) => {
    if (onSelectedRowsChanged) onSelectedRowsChanged(rows)
  }

  //eslint-disable-next-line no-undef
  const onCellClick = async (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    switch (params.field) {
      case "expand": {
        event.stopPropagation()
        const row = params.row
        row.expanded = !row.expanded
        apiRef.current.updateRows([row])
        break
      }
      case "trash": {
        event.stopPropagation()
        onDeleteWallet(params.row.address)
        break
      }
      case "address":
        event.stopPropagation()
        break
      default:
    }

    const column = apiRef.current.getColumn("address")
    apiRef.current.updateColumns([column])
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
        columns={getWalletsColumns()}
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
