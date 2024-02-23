import { FormControl } from '@mui/material'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import AppInputLabel from './AppInputLabel'
import { AppInputProps } from './AppInputProps'
import { InputErrorMessage } from './InputErrorMessage'

export default function AppTextField({
  fieldError,
  required,
  label,
  ...props
}: TextFieldProps &
  AppInputProps & {
    fieldError?: string | undefined | boolean
  }) {
  return (
    <FormControl sx={{ minWidth: 120, width: '100%' }}>
      <AppInputLabel fieldLabel={label} required={required} />
      <TextField
        {...props}
        helperText={
          fieldError ? (
            <InputErrorMessage> {fieldError} </InputErrorMessage>
          ) : null
        }
      ></TextField>
    </FormControl>
  )
}
