import * as React from 'react'
import { AppInputLabel } from './AppInputLabel'
import { FormControl, Select, SelectProps } from '@mui/material'

export interface Props extends SelectProps {}

export default function AppSelect({ children, label, ...props }: Props) {
  return (
    <div>
      <FormControl sx={{ minWidth: 120, width: '100%' }}>
        <AppInputLabel>{label}</AppInputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          {...props}
        >
          {children}
        </Select>
      </FormControl>
    </div>
  )
}
