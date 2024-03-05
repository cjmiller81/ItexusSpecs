import PageTitle from "@/components/TextDisplay/PageTitle"
import { walletsColumns } from "@/constants/ColumnsDefs/WalletsTable"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { ExpandableRow } from "@/containers/MyWallets/TokensRow"
import { TotalWalletsWorthCard } from "@/containers/MyWallets/TotalWalletsWorthCard"
import { StyledWalletsTable } from "@/containers/MyWallets/WalletsTable"
import { createWallet, deleteWallet, fetchWallets } from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Wallet } from "@/models/Wallet/Wallet"
import { getWalletsUsdTotal } from "@/utils/tokensTableHelpers"
import { Box, Button } from "@mui/material"
import { styled } from "@mui/system"
import { GridCellParams, MuiEvent, useGridApiRef } from "@mui/x-data-grid"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { WalletInputModal } from "../../components/Modals/WalletInputModal"

type WalletRow = Wallet & { expanded: boolean }
export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets } = useAppSelector(state => state.walletsReducer.wallets)
  const dispatch = useAppDispatch()

  const { t } = useTranslation("MyWalletsPage")
  const walletsRows = wallets.map<WalletRow>(wallet => ({ ...wallet, expanded: false }))

  const apiRef = useGridApiRef()
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchWallets(null))
  }, [dispatch])

  const walletsTotal = useMemo(() => getWalletsUsdTotal(wallets), [wallets])

  const onAddWallet = async (walletAddress: string | null) => {
    if (walletAddress) {
      dispatch(createWallet(walletAddress))
    }
    setAddWalletModalOpen(false)
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
        dispatch(deleteWallet(params.row.address))
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

  const growPercentage = -22.2323

  return (
    <>
      {addWalletModalOpen && (
        <WalletInputModal
          open={addWalletModalOpen}
          onEnter={onAddWallet}
          onClose={() => setAddWalletModalOpen(false)}
        />
      )}
      <StyledWalletWorthContainer>
        <TotalWalletsWorthCard
          growPercentage={growPercentage}
          totalWorth={walletsTotal}
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
        <PageTitle sx={{ mt: 2 }}>{t("Wallets")}</PageTitle>
      </StyledAdaptivePageBox>

      <StyledWalletsTable
        loading={statusFetchingWallets === "loading"}
        slots={{
          row: ExpandableRow,
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
        columns={walletsColumns}
        rows={walletsRows}
      />
      <HistoricalWalletsWorth
        title={t("HistoricalWalletsWorth")}
        sx={{ mt: 6 }}
      />
    </>
  )
}

const StyledWalletWorthContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: 20,
  top: 80,
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

const StyledAdaptivePageBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}))

const StyledAddWalletButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(4),
  },
}))
