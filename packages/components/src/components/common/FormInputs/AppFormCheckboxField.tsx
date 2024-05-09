import { useField } from "formik"

import { Checkbox, CheckboxProps } from "@mui/material"

export type AppFormCheckboxFieldProps = Omit<CheckboxProps, "name"> & { name: string }

export function AppFormCheckboxField({ name, ...props }: AppFormCheckboxFieldProps) {
  const [field] = useField({ name })
  return (
    <Checkbox
      {...props}
      {...field}
    />
  )
}
