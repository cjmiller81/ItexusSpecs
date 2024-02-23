import { FormControl } from '@mui/material'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers'
import AppInputLabel from './AppInputLabel'
import { AppInputProps } from './AppInputProps'

export interface Props extends DatePickerProps<Date>, AppInputProps {}

export default function AppDatePicker({ required, label, ...props }: Props) {
  return (
    <div>
      <FormControl sx={{ minWidth: 120, width: '100%' }}>
        <AppInputLabel fieldLabel={label} required={required} />
        <DatePicker {...props} />
      </FormControl>
    </div>
  )
}
