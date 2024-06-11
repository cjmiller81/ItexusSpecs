import { Paper, PaperProps, Typography } from "@mui/material"
import { Stack } from "@mui/system"

type Props = PaperProps & {
  title: string
  subtitle: string
}
export default function UserMetricCard({ title, subtitle, ...props }: Props) {
  return (
    <Paper {...props} style={{ width: "200px" }} elevation={3}>
      <Stack sx={{ padding: 2 }}>
        <Typography
          textAlign="right"
          sx={{ fontSize: "10px" }}>
          {title}
        </Typography>
        <Typography textAlign="right">{subtitle}</Typography>
      </Stack>
    </Paper>
  )
}
