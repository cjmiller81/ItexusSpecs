import { FormControl } from "@mui/material"
import AppInputLabel from "./AppInputLabel"
import { AppInputProps } from "./AppInputProps"
import { CustomNumberInput } from "./BaseNumberInput"
import {
  NumberInputProps
} from "@mui/base/Unstable_NumberInput"

export interface Props extends NumberInputProps, AppInputProps {}

export default function AppUpDown({ label, required, ...props }: Props) {
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
