import { FormControl, Select, SelectProps } from '@mui/material'
import AppInputLabel from './AppInputLabel'
import { AppInputProps } from './AppInputProps'

export interface Props extends SelectProps {}

export default function AppSelect({
  children,
  required,
  label,
  ...props
}: SelectProps & AppInputProps) {
  return (
    <div>
      <AppInputLabel fieldLabel={label} required={required} />
      <FormControl sx={{ minWidth: 120, width: '100%' }}>
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
