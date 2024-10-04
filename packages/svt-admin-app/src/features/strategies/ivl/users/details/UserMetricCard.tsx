import { Paper, PaperProps, Typography } from "@mui/material"
import { Stack } from "@mui/system"

type Props = PaperProps & {
  title: string | undefined
  subtitle: string | undefined
}
export default function UserMetricCard({ title, subtitle, ...props }: Props) {
  return (
    <Paper {...props} style={{ width: "160px", maxHeight: "70px", display: "flex", justifyContent: "center"}} elevation={3}>
      <Stack direction="column" spacing={0} sx={{ justifyContent: "center", alignItems: "center", padding: 2 }}>
        {title && 
        (<Typography sx={{ fontSize: "10px" }}>{title}</Typography>)}
        {subtitle && 
        (<Typography sx={{ fontWeight: 600}}>{subtitle}</Typography>)}
      </Stack>
    </Paper>
  )
}
