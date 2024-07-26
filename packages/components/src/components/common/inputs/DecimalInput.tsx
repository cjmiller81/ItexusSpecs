import { TextField, TextFieldProps } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { AppInputProps } from "./AppInputProps";

type AppInputPropsOverride = Omit<AppInputProps, "onChange" | "value"> & {
  onChange?: (value: number) => void;
  value: number;
};

export type DecimalInputProps = Omit<TextFieldProps, "onChange"> &
  AppInputPropsOverride & {
    max?: number;
    maxDecimals?: number;
    postFormatter?: (numberValue: number, formattedValue: string) => string;
  };

export const DecimalInput = ({
  onChange,
  value,
  max,
  maxDecimals,
  onSelect,
  onKeyDown,
  postFormatter,
  ...props
}: DecimalInputProps) => {
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
      inputRef.current!.value = formatValue(value);
  }, [value]);
  
  const getCursor = () => inputRef!.current!.selectionStart || 0;
  const setCursor = (position: number) => inputRef.current?.setSelectionRange(position, position);

  const formatValue = (value: number) => {
    let formatedValue = value.toFixed(maxDecimals);
    if (postFormatter) formatedValue = postFormatter(value, formatedValue);

    return formatedValue;
  };

  const setFormattedValue = (value: string) => (inputRef.current!.value = value);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let inputValue = event.target.value;
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      return;
    }

    if (inputValue === "") inputValue = "0";

    if (maxDecimals === 0 && inputValue.includes(".")) {
      return;
    }

    let floatValue = parseFloat(inputValue);
    if (!isNaN(floatValue)) {
      if (max !== undefined && floatValue >= max) {
        floatValue = max;
      }

      const formatedValue = formatValue(floatValue);
      
      const newCursor =
      event.target!.selectionStart! >= formatedValue.length ? formatedValue.length : event.target!.selectionStart!;
      event.target.value = formatedValue;
      event.target.setSelectionRange(newCursor, newCursor);
      handleOnChange(floatValue);
    }
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

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    const input = inputRef.current;
    let newValue = inputRef.current!.value;
    const decimalIndex = newValue.indexOf(".") + 1;
    const cursor = getCursor();
    if (input && cursor !== null) {
      if (event.key === "Backspace") {
        if (decimalIndex === cursor) {
          if (cursor) setCursor(cursor - 1);
          event.preventDefault();
        } else if (maxDecimals != 0 && cursor > decimalIndex) {
          event.preventDefault();
          newValue = newValue.substring(0, cursor - 1) + "0" + newValue.substring(cursor);
          setFormattedValue(newValue);
          if (cursor) setCursor(cursor - 1);
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
        } else if (maxDecimals != 0 && cursor >= decimalIndex) {
          event.preventDefault();
          newValue = newValue.substring(0, cursor) + "0" + newValue.substring(cursor + 1);
          setFormattedValue(newValue);
          setCursor(cursor + 1);
        }
      }
    }

    if (onKeyDown) onKeyDown(event);
  };

  return (
    <TextField
      type="text"
      inputRef={inputRef}
      onSelect={onSelectChanged}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...props}
    />
  );
};
