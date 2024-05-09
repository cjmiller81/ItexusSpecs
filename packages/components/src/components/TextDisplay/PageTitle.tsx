import { Typography, TypographyProps } from "@mui/material"

export function PageTitle({ ...props }: TypographyProps) {
  return (
    <Typography
      variant="h6"
      {...props}
    />
  )
}
