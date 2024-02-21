import { FormControl } from '@mui/material'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers'
import { AppInputLabel } from './AppInputLabel'

export interface Props extends DatePickerProps<Date> {}

export default function AppDatePicker({ label, ...props }: Props) {
  return (
    <div>
      <FormControl sx={{ minWidth: 120, width: '100%' }}>
        <AppInputLabel>{label}</AppInputLabel>
        <DatePicker {...props} />
      </FormControl>
    </div>
  )
}
