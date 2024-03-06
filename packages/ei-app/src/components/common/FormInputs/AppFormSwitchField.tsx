import { Switch, SwitchProps } from "@mui/material"
import { useField } from "formik"

export type AppFormSwitchFieldProps = Omit<SwitchProps, "name"> & { name: string }

export default function AppFormSwitchField({ name, ...props }: AppFormSwitchFieldProps) {
  const [field] = useField({ name })
  return (
    <Switch
      {...props}
      value={field.checked}
      onChange={field.onChange}
      name={name}
    />
  )
}
