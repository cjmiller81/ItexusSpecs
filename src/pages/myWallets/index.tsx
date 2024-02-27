import { TotalWalletsWorthCard } from "@/components/Cards/TotalWalletsWorth/TotalWalletsWorthCard"
import BasicTable from "@/components/DataDisplay/BasicTable"
import PageTitle from "@/components/TextDisplay/PageTitle"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { walletsColumns } from "@/containers/MyWalletsTable/mocks"
import { tokensRows } from "@/containers/TokensTable/mocks"
import { WalletAsset } from "@/models/Wallet/walletAsset"
import { Box, Button } from "@mui/material"
import { styled } from "@mui/system"
import { GridCellParams, MuiEvent, useGridApiRef } from "@mui/x-data-grid"
import { useState } from "react"
import React from "react"
import { WalletInputModal } from "../../components/library/InputFields/WalletInputModal"

const tableStyles = {
  width: "100%",
  mt: 2,
  "& .MuiDataGrid-row": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-cell--withRenderer": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-withBorderColor": {
    bgColor: "transparent",
  },
}

interface WalletAssetTableRow extends WalletAsset {
  expanded: boolean
}

export default function MyWalletsPage() {
  const [walletsAssets, setWalletAsset] = useState<WalletAssetTableRow[]>(
    tokensRows.map(tokenRow => ({ ...tokenRow, expanded: false })),
  )

  const apiRef = useGridApiRef()
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false)

  const onAddWalletButtonHandle = () => {
    setAddWalletModalOpen(true)
  }

  const onAddWallet = (walletAddress: string | null) => {
    if (walletAddress)
      setWalletAsset([
        ...walletsAssets,
        {
          address: walletAddress,
          assets: tokensRows[0].assets,
          expanded: false,
        },
      ])
    setAddWalletModalOpen(false)
  }

  const onCellClick = (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    switch (params.field) {
      case "expand":
        event.stopPropagation()
        setWalletAsset([...walletsAssets])
        break
      case "trash":
        event.stopPropagation()
        setWalletAsset(walletsAssets.filter(x => x.address !== params.row.address))
        break
      case "walletAddress":
        event.stopPropagation()
        break
      default:
    }

    const column = apiRef.current.getColumn("walletAddress")
    column.minWidth = walletsAssets.some(asset => asset.expanded) ? 720 : 300
    apiRef.current.updateColumns([column])
  }

  const totalWorth = walletsAssets.reduce(
    (total, curValue) => total + curValue.assets.reduce((acc, cur) => acc + cur.usdValue, 0),
    0,
  )
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
          totalWorth={totalWorth}
        />
      </StyledWalletWorthContainer>
      <StyledAdaptivePageBox>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={onAddWalletButtonHandle}>
          +Add Wallet
        </Button>
      </StyledAdaptivePageBox>
      <StyledAdaptivePageBox>
        <PageTitle sx={{ mt: 2 }}>Wallets</PageTitle>
      </StyledAdaptivePageBox>

      <BasicTable
        getRowHeight={() => "auto"}
        onCellClick={onCellClick}
        apiRef={apiRef}
        sx={tableStyles}
        getRowId={x => x.address}
        columns={walletsColumns}
        rows={walletsAssets}
      />
      <HistoricalWalletsWorth sx={{ mt: 6 }} />
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
