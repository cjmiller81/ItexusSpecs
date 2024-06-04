import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ReactNode } from 'react'

export interface Props {
  required?: boolean
  fieldLabel?: ReactNode
}

export default function AppInputLabel({ required, fieldLabel }: Props) {
  return (
    <AppInputLabelText>
      {fieldLabel}
      {required && <span style={{ paddingLeft: '4px' }}>*</span>}
    </AppInputLabelText>
  )
}

const AppInputLabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  paddingBottom: 4,
  textWrap: 'nowrap',
}))
