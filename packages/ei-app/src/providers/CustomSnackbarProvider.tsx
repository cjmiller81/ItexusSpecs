import { Snackbar } from '@mui/material'
import React, { useCallback } from 'react'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

interface ICustomSnackbarProps {
  open: boolean
  onClose: (isOpen: boolean) => void
  message: string
  autoHideDuration?: number
  severity?: AlertProps['severity']
}

const CustomSnackbar: React.FC<ICustomSnackbarProps> = ({ open, onClose, severity = 'success', message, autoHideDuration = 6000 }) => {
  const handleClose = useCallback(
    () => {
      // if (reason === 'clickaway') {
      //   return
      // }

      onClose(false)
    },
    [onClose]
  )

  return (
    <Snackbar sx={{ zIndex: 99999 }} open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
      <MuiAlert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  )
}

export default CustomSnackbar
