import { FormControl } from "@mui/material"
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers"
import { AppInputProps } from "./AppInputProps"
import { AppInputLabel } from "./AppInputLabel"

export type Props = DatePickerProps<Date> & AppInputProps

export function AppDatePicker({ required, tooltip, label, ...props }: Props) {
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
