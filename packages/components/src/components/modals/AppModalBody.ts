import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const AppModalBody:any = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderColor: theme.palette.grey[500],
  borderStyle: 'solid',
  backgroundColor: theme.palette.background.paper,
  borderWidth: 1,
  padding: theme.spacing(3),
}))
