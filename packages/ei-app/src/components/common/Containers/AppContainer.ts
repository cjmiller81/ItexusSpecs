import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const AppContainer = styled(Box)(({ theme }) => ({
  border: 'solid',
  borderWidth: '1px',
  boxSizing: 'border-box',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
}))
