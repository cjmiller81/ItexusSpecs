import React, { FC } from "react";
import { ContrastDecimalField, ContrastTextField } from "../ContrastDecimalField";

type IntersectionType<T, U> = Pick<T, Extract<keyof T, keyof U>> & Pick<U, Extract<keyof U, keyof T>>;
type CommonType = IntersectionType<
  React.ComponentProps<typeof ContrastDecimalField>,
  React.ComponentProps<typeof ContrastTextField>
>;

const MinMaxField: FC<CommonType> = ({ value, label, ...props }) => {
  const defaultProps: CommonType = {
    label: label,
    size: "small",
    disabled: true,
    sx: { input: { padding: "4px" }, width: "115px" },
  };

  if (value === undefined) {
    return (
      <ContrastTextField
        {...defaultProps}
        value="--"
        {...props}
      />
    );
  } else {
    return (
      <ContrastDecimalField
        {...defaultProps}
        value={value}
        maxDecimals={2}
        {...props}
      />
    );
  }
};

export default MinMaxField;
