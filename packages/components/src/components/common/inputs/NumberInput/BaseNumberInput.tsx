import { NumberInputProps,  Unstable_NumberInput as BaseNumberInput } from "@mui/base/Unstable_NumberInput"
import * as React from "react"
import { StyledInputElement } from "./StyledInputElement"
import { StyledInputRoot } from "./StyledInputRoot"
import { StyledButton } from "./StyledButton"

export const CustomNumberInput = React.forwardRef(function CustomNumberInput(
  props: NumberInputProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <BaseNumberInput
      style={{ width: "100%" }}
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: "▴",
        },
        decrementButton: {
          children: "▾",
        },
      }}
      {...props}
      ref={ref}
    />
  )
})
