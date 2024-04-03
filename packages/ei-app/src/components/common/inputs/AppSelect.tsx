import { FormControl, Select, SelectProps } from "@mui/material"
import AppInputLabel from "./AppInputLabel"
import { AppInputProps } from "./AppInputProps"

export default function AppSelect({ children, tooltip, required, label, ...props }: SelectProps & AppInputProps) {
  return (
    <div>
      <AppInputLabel
        fieldLabel={label}
        required={required}
        tooltip={tooltip}
      />
      <FormControl style={{ minWidth: 120, width: "100%" }}>
        <Select
          style={{ width: "100%" }}
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          {...props}>
          {children}
        </Select>
      </FormControl>
    </div>
  )
}
