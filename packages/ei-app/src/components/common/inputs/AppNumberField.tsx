import { FormControl, FormControlProps, TextField, TextFieldProps } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import AppInputLabel from "./AppInputLabel"
import { AppInputProps } from "./AppInputProps"
import { InputErrorMessage } from "./InputErrorMessage"

type AppInputPropsOverride = Omit<AppInputProps, "onChange" | "value"> & {
  onChange: (value: number) => void
  value: number
}

export type AppNumberInputProps = Omit<FormControlProps, "onChange"> &
  AppInputPropsOverride & {
    fieldError?: string | undefined | boolean
    inputProps?: TextFieldProps
    max?: number
    maxDecimals?: number
    postFormatter?: (numberValue: number, formattedValue: string) => string
  }

export default function AppNumberField({
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
  useEffect(() => {
    const caretPosition = inputRef.current ? inputRef.current.selectionStart : 0
    console.log(caretPosition)
    setFormattedValue(value.toFixed(maxDecimals))
  }, [value])

  const [cursor, setCursor] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>()
  useEffect(() => {
    inputRef.current?.setSelectionRange(cursor, cursor)
  }, [inputRef, cursor, value])

  const [formattedValue, setFormattedValue] = useState<string>(value.toString())
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      return
    }

    inputValue = inputValue.replace(",", ".")
    if (inputValue === "") inputValue = "0"

    if (maxDecimals === 0 && inputValue.includes(".")) {
      return
    }

    let floatValue = parseFloat(inputValue)
    if (!isNaN(floatValue)) {
      if (max !== undefined && floatValue >= max) {
        floatValue = max
      }

      onChange(floatValue)
      const formatedValue = floatValue.toFixed(maxDecimals)
      setFormattedValue(formatedValue)
      const newCursor =
        event.target!.selectionStart! >= formatedValue.length ? formatedValue.length : event.target!.selectionStart!
      setCursor(newCursor)
    }

    event.preventDefault()
  }

  const onSelectChanged = () => {
    if (inputRef.current && inputRef.current.selectionStart === inputRef.current.selectionEnd)
      setCursor(inputRef.current.selectionStart!)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      const input = inputRef.current
      if (input) {
        if (cursor !== null) {
          let newValue = formattedValue
          const decimalIndex = newValue.indexOf(".") + 1
          if (decimalIndex === cursor) {
            if (cursor) setCursor(cursor - 1)
            event.preventDefault()
          }

          if (maxDecimals != 0 && cursor > decimalIndex) {
            event.preventDefault()
            newValue = newValue.substring(0, cursor - 1) + "0" + newValue.substring(cursor)
            setFormattedValue(newValue)
            if (cursor) setCursor(cursor - 1)
          }
        }
      }
    }
  }

  return (
    <FormControl
      style={{ width: "100%" }}
      {...props}>
      <AppInputLabel
        fieldLabel={label}
        required={required}
      />
      <TextField
        {...inputProps}
        type="text"
        inputRef={inputRef}
        value={formattedValue}
        onSelect={onSelectChanged}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        error={!!fieldError}
        helperText={fieldError ? <InputErrorMessage>{fieldError}</InputErrorMessage> : null}
      />
    </FormControl>
  )
}
