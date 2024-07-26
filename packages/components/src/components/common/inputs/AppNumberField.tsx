import { FormControl, FormControlProps } from "@mui/material";
import { AppInputLabel } from "./AppInputLabel";
import { AppInputProps } from "./AppInputProps";
import { DecimalInput, DecimalInputProps } from "./DecimalInput";
import { InputErrorMessage } from "./InputErrorMessage";

type AppInputPropsOverride = Omit<AppInputProps, "onChange" | "value"> & {
  onChange?: (value: number) => void;
  value: number;
};

export type AppNumberInputProps = Omit<FormControlProps, "onChange"> &
  AppInputPropsOverride & {
    fieldError?: string | undefined | boolean;
    inputProps?: DecimalInputProps;
    max?: number;
    maxDecimals?: number;
  };

export function AppNumberField({
  fieldError,
  required,
  label,
  inputProps,
  onChange,
  value,
  max,
  maxDecimals,
  ...props
}: AppNumberInputProps) {
  return (
    <FormControl
      style={{ width: "100%" }}
      {...props}>
      <AppInputLabel
        fieldLabel={label}
        required={required}
      />
      <DecimalInput
        {...inputProps}
        error={!!fieldError}
        helperText={fieldError ? <InputErrorMessage>{fieldError}</InputErrorMessage> : null}
        value={value}
        max={max}
        maxDecimals={maxDecimals}
      />
    </FormControl>
  );
}
