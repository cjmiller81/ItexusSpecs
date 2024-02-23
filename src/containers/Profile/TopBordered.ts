import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const TopBordered = styled(Box)(({ theme }) => ({
  border: '0px solid',
  borderTop: '1px solid',
  paddingTop: theme.spacing(2),
  borderColor: theme.palette.divider,
}))
