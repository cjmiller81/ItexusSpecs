import { FormControl, FormControlProps } from '@mui/material'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import AppInputLabel from './AppInputLabel'
import { AppInputProps } from './AppInputProps'
import { InputErrorMessage } from './InputErrorMessage'

export type AppTextFieldProps = FormControlProps &
  AppInputProps & {
    fieldError?: string | undefined | boolean
    inputProps?: TextFieldProps
  }

export default function AppTextField({ fieldError, required, label, inputProps, ...props }: AppTextFieldProps) {
  return (
    <FormControl
      style={{ width: '100%' }}
      {...props}>
      <AppInputLabel
        fieldLabel={label}
        required={required}
      />
      <TextField
        {...inputProps}
        error={!!fieldError}
        helperText={fieldError ? <InputErrorMessage> {fieldError} </InputErrorMessage> : null}
      />
    </FormControl>
  )
}
