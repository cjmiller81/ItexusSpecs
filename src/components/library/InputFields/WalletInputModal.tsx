import { AppModal } from '@/components/Modals/AppModal'
import { Box, Button, Input, Typography } from '@mui/material'
import { useState } from 'react'

export interface WalletInputProps {
  onClose: () => void
  //eslint-disable-next-line no-unused-vars
  onEnter: (walletAddress: string | null) => void
  open: boolean
}

export const WalletInputModal = ({
  onClose,
  onEnter,
  open,
}: WalletInputProps) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  return (
    <AppModal onClose={onClose} open={open}>
      <>
        <Typography variant="h6">Add new wallet</Typography>
        <Input
          sx={{ mt: 2 }}
          placeholder="Address"
          defaultValue={null}
          fullWidth
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        ></Input>

        <Box sx={{ display: 'flex', flexFlow: 'row-reverse', gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={() => onEnter(walletAddress)}>
            Save
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </>
    </AppModal>
  )
}
