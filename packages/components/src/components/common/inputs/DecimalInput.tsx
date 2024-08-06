import { TextField, TextFieldProps } from "@mui/material";
import React, { KeyboardEventHandler, useEffect, useRef } from "react";
import { AppInputProps } from "./AppInputProps";

type AppInputPropsOverride = AppInputProps & {
  onChange?: (value: number) => void;
  value?: number;
};

export type DecimalInputProps = Omit<TextFieldProps, "onChange" | "value"> &
  AppInputPropsOverride & {
    max?: number;
    min?: number;
    maxDecimals?: number;
  };

export const DecimalInput = ({
  onChange,
  value,
  max,
  min,
  maxDecimals,
  onSelect,
  onKeyDown,
  onBlur,
  ...props
}: DecimalInputProps) => {
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    inputRef.current!.value = formatWithSeparators(value || 0);
  }, [value]);

  const getCursor = () => inputRef!.current!.selectionStart || 0;
  const setCursor = (position: number) => inputRef.current?.setSelectionRange(position, position);

  const formatWithSeparators = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: maxDecimals,
    });
  };

  const testFormattedValue = (value: string) => /^[0-9,.]+$/.test(value);
  const setFormattedValue = (value: string) => (inputRef.current!.value = value);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let inputValue = event.target.value;
    if (!testFormattedValue(inputValue)) {
      return false;
    }

    if (inputValue === "") inputValue = "0";
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
    let floatValue = parseFloat(inputRef.current!.value.replace(/,/g, ""));
    if (!isNaN(floatValue)) {
      if (max !== undefined) floatValue = floatValue > max ? max : floatValue;
      if (min !== undefined) floatValue = floatValue < min ? min : floatValue;
      const formattedValue = formatWithSeparators(floatValue);
      setFormattedValue(formattedValue);
    }
    if (onBlur) onBlur(event);

    handleOnChange(floatValue);
  };

  const handleOnChange = (value: number) => {
    if (onChange) {
      onChange(value);
    }
  };

  const onSelectChanged: React.ReactEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    if (inputRef.current && inputRef.current.selectionStart === inputRef.current.selectionEnd)
      setCursor(inputRef.current.selectionStart!);
    if (onSelect) onSelect(event);
  };

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> | undefined = event => {
    if (
      !event.code.startsWith("Digit") &&
      !/^Numpad[0-9]$/.test(event.code) &&
      !(event.code === "Period" || (event.code === "NumpadDecimal" && !inputRef.current!.value.includes(".")))
    ) {
      event.preventDefault();
      return false;
    }
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    const input = inputRef.current;
    let newValue = inputRef.current!.value;
    const decimalIndex = newValue.indexOf(".") + 1;
    const cursor = getCursor();
    if (input && cursor !== null && newValue.includes(".")) {
      if (event.key === "Backspace") {
        if (decimalIndex === cursor) {
          if (cursor) setCursor(cursor - 1);
          event.preventDefault();
        }
      }
      if (event.key === "Delete") {
        if (decimalIndex === 2 && cursor === 0) {
          event.preventDefault();
          setFormattedValue("0" + newValue.substring(decimalIndex - 1));
          setCursor(cursor + 1);
        } else if (decimalIndex === cursor + 1) {
          if (cursor) setCursor(cursor + 1);
          event.preventDefault();
        } else if (cursor === newValue.length) {
          event.preventDefault();
        }
      }
    }

    if (onKeyDown) onKeyDown(event);
  };

  return (
    <TextField
      onKeyPress={handleKeyPress}
      type="text"
      inputRef={inputRef}
      onSelect={onSelectChanged}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
};
