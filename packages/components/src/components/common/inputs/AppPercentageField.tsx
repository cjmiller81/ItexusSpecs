import Percent from "@mui/icons-material/Percent";
import { AppNumberField, AppNumberInputProps } from "./AppNumberField";

export function AppPercentageField({ ...props }: AppNumberInputProps) {
  const { inputProps } = props;

  return (
    <AppNumberField
      {...props}
      // @ts-ignore
      inputProps={{
        ...inputProps,
        InputProps: {
          endAdornment: <Percent />,
        },
      }}
    />
  );
}
