import BasicTable from '@/components/DataDisplay/BasicTable'
import { walletsColumns } from '@/containers/MyWalletsTable/mocks'
import { tokensRows } from '@/containers/TokensTable/mocks'
import { WalletAsset } from '@/models/Wallet/walletAsset'
import { Box, Button, Typography } from '@mui/material'
import { useGridApiRef } from '@mui/x-data-grid'
import { useState } from 'react'
import { WalletInputModal } from './walletInputModal'

const tableStyles = {
  height: 700,
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

  return (
    <>
      <Button variant="contained" onClick={onAddWalletButtonHandle}>
        Add Wallet
      </Button>
      {addWalletModalOpen && (
        <WalletInputModal
          open={addWalletModalOpen}
          onEnter={onAddWallet}
          onClose={() => setAddWalletModalOpen(false)}
        />
      )}
      <Typography variant="h6" sx={{ mt: 5 }}>
        Wallets
      </Typography>
      <Box mt={2}>
        <BasicTable
          onCellClick={onCellClick}
          apiRef={apiRef}
          sx={tableStyles}
          getRowId={(x) => x.address}
          columns={walletsColumns}
          rows={walletsAssets}
        />
      </Box>
    </>
  )
}
