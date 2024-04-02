import { FormControl } from "@mui/material"
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers"
import AppInputLabel from "./AppInputLabel"
import { AppInputProps } from "./AppInputProps"

export type Props = DatePickerProps<Date> & AppInputProps

export default function AppDatePicker({ required, tooltip, label, ...props }: Props) {
  return (
    <div>
      <FormControl sx={{ minWidth: 120, width: "100%" }}>
        <AppInputLabel
          fieldLabel={label}
          tooltip={tooltip}
          required={required}
        />
        <DatePicker {...props} />
      </FormControl>
    </div>
  )
}
