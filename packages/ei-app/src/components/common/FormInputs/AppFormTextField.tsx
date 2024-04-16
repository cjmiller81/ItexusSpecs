import { useField } from 'formik'
import AppTextField, { AppTextFieldProps } from '../inputs/AppTextField'

export type AppFormTextFieldProps = Omit<AppTextFieldProps, 'name'> & { name: string }

export default function AppFormTextField({ name, inputProps, defaultValue, ...props }: AppFormTextFieldProps) {
  const [field, meta] = useField({ name })
  return (
    <AppTextField
      {...props}
      {...field}
      inputProps={{ ...field, ...inputProps, name: name }}
      fieldError={meta.error}
    />
  )
}
