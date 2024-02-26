import BasicTable from '@/components/DataDisplay/BasicTable'
import { walletsColumns } from '@/containers/MyWalletsTable/mocks'
import { tokensRows } from '@/containers/TokensTable/mocks'
import { WalletAsset } from '@/models/Wallet/walletAsset'
import { Box, Button, Typography } from '@mui/material'
import { useGridApiRef } from '@mui/x-data-grid'
import { useState } from 'react'
import { TotalWalletsWorthCard } from '@/components/Cards/TotalWalletsWorth/TotalWalletsWorthCard'
import { WalletInputModal } from '../../components/library/InputFields/WalletInputModal'
import { HistoricalWalletsWorth } from '@/containers/HistoricalWalletsWorth/HistoricalWalletsWorth'

const tableStyles = {
  '& .MuiDataGrid-row': {
    maxHeight: '1000px !important',
  },
  '.MuiDataGrid-cell--withRenderer': {
    maxHeight: '1000px !important',
  },
  '.MuiDataGrid-withBorderColor': {
    bgColor: 'transparent',
  },
}

interface WalletAssetTableRow extends WalletAsset {
  expanded: boolean
}

export default function MyWalletsPage() {
  const [walletsAssets, setWalletAsset] = useState<WalletAssetTableRow[]>(
    tokensRows.map((tokenRow) => ({ ...tokenRow, expanded: false })),
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

  const onCellClick = (params: any, event: any) => {
    switch (params.field) {
      case 'expand':
        event.stopPropagation()
        setWalletAsset([...walletsAssets])
        break
      case 'trash':
        event.stopPropagation()
        setWalletAsset(
          walletsAssets.filter((x) => x.address !== params.row.address),
        )
        break
      case 'walletAddress':
        event.stopPropagation()
        break
      default:
    }
  }

  const totalWorth = walletsAssets.reduce(
    (total, curValue) =>
      total + curValue.assets.reduce((acc, cur) => acc + cur.usdValue, 0),
    0,
  )
  const growPercentage = -22.2323

  return (
    <>
      <Box>
        <Button variant="contained" onClick={onAddWalletButtonHandle}>
          +Add Wallet
        </Button>
        <Box sx={{ position: 'absolute', right: 20, top: 80 }}>
          <TotalWalletsWorthCard
            growPercentage={growPercentage}
            totalWorth={totalWorth}
          />
        </Box>
      </Box>
      {addWalletModalOpen && (
        <WalletInputModal
          open={addWalletModalOpen}
          onEnter={onAddWallet}
          onClose={() => setAddWalletModalOpen(false)}
        />
      )}
      <Typography variant="h5" sx={{ mt: 5 }}>
        Wallets
      </Typography>
      {/* <Box mt={2}>
        <BasicTable
          getRowHeight={() => 'auto'}
          onCellClick={onCellClick}
          apiRef={apiRef}
          sx={tableStyles}
          getRowId={(x) => x.address}
          columns={walletsColumns}
          rows={walletsAssets}
        />
      </Box> */}
      <HistoricalWalletsWorth sx={{ mt: 3 }} />
    </>
  )
}
