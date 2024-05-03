import { NumberInputProps } from "@mui/base/Unstable_NumberInput"
import { FormControl } from "@mui/material"
import { AppInputProps } from "../AppInputProps"
import { CustomNumberInput } from "./BaseNumberInput"
import { AppInputLabel } from "../AppInputLabel"

export interface AppNumberInputProps extends NumberInputProps, AppInputProps {}

export function AppNumberInput({ label, required, ...props }: AppNumberInputProps) {
  return (
    <FormControl style={{ minWidth: 120, width: "100%" }}>
      <AppInputLabel
        fieldLabel={label}
        required={required}
      />
      <CustomNumberInput {...props} />
    </FormControl>
  )
}
