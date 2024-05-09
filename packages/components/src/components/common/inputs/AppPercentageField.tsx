import Percent from "@mui/icons-material/Percent"
import { AppNumberField, AppNumberInputProps } from "./AppNumberField"

export function AppPercentageField({ ...props }: AppNumberInputProps) {
  const { inputProps } = props

  return (
    <AppNumberField
      {...props}
      inputProps={{
        ...inputProps,
        InputProps: {
          endAdornment: <Percent />,
        },
      }}
    />
  )
}
