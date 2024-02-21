import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const AppInputLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  paddingBottom: 4,
}))
