import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import "./currency-input.scss";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        isAllowed={(values) => {
          const { formattedValue, floatValue } = values;
          if (floatValue == null) {
            return formattedValue === "";
          } else {
            return floatValue <= 100000000 && floatValue >= 0;
          }
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
      />
    );
  }
);

interface FormattedInputsProps {
  disabled: boolean;
  capitalAllocation: number;
  onBlur?: (newCapitalAllocation: number) => void | undefined;
  onChange?: (newCapitalAllocation: number) => void | undefined;
  onEditingChange?: (editing: boolean) => void | undefined;
  error: boolean
  errorMessage: string
}

export default function FormattedInputs({ disabled, capitalAllocation, onChange, onBlur, onEditingChange, error, errorMessage }: FormattedInputsProps) {
  const [localCapitalAllocation, setLocalCapitalAllocation] = React.useState<number>(capitalAllocation);
  const [isBlurring, setIsBlurring] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const handleBlur = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (onEditingChange) {
      onEditingChange(false);
    }
    if (onBlur) {
      onBlur(localCapitalAllocation);
    }
    setIsBlurring(true);
    setIsEditing(false);
  }, [localCapitalAllocation, onBlur, onEditingChange]);

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCapitalAllocation(parseFloat(event.target.value));
    if (onChange) {
      onChange(parseFloat(event.target.value));
    }
  }, [onChange]);

  const handleFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (onEditingChange) {
      onEditingChange(true);
    }
    setIsEditing(true);
  }, [onEditingChange]);

  React.useEffect(() => {
    if (!isEditing && !isBlurring && localCapitalAllocation !== capitalAllocation) {
      setLocalCapitalAllocation(capitalAllocation);
    } else if (isBlurring && localCapitalAllocation === capitalAllocation) {
      setIsBlurring(false);
    } else if (isBlurring && isNaN(localCapitalAllocation)) {
      setIsBlurring(false);
    }
  }, [capitalAllocation, isBlurring, isEditing, localCapitalAllocation]);

  return (
    <Stack direction="row" spacing={2} className={"currency-input"}>
      <TextField
        disabled={disabled}
        value={localCapitalAllocation}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        name="numberformat"
        id="formatted-numberformat-input"
        className={"currency-input-field"}
        InputProps={{
          inputComponent: NumericFormatCustom as any,
        }}
        helperText={errorMessage}
        error={error}
      />
    </Stack>
  );
}
