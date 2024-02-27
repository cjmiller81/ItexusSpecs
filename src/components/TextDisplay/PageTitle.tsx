import { Typography, TypographyProps } from "@mui/material"
import * as React from "react"

export default function PageSubtitle({ ...props }: TypographyProps) {
  return (
    <Typography
      variant="h6"
      {...props}
    />
  )
}
