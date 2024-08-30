import { ReactNode } from "react"

export interface AppInputProps {
  required?: boolean
  label?: boolean | ReactNode |string | undefined
  tooltip?: string 
}
