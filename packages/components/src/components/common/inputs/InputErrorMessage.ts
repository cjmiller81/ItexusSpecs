import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const InputErrorMessage:any = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  paddingBottom: 4,
  fontSize: '12px',
  textWrap: 'nowrap',
}))
