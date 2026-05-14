import React from 'react';
import { NumericFormat } from 'react-number-format';

export function NumericFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator=","
      decimalSeparator="."
      valueIsNumericString
    />
  );
}
