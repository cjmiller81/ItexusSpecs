import { CircularProgress, Typography } from "@mui/material"
import { Stack, StackProps } from "@mui/system"
import { FC, ReactNode } from "react"

export type DashboardTileProps = StackProps & {
  title: string
  icon: ReactNode
  loading?: boolean
}

export const DashboardTile: FC<DashboardTileProps> = ({ title, icon, children, loading, sx, ...props }) => {
  return (
    <Stack
      sx={{
        ...sx,
      }}
      {...props}>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}>
        {icon}
        <Typography
          sx={{ pt: "2px" }}
          variant="h6">
          {title}
        </Typography>
        {loading && (
          <CircularProgress
            sx={{ color: "success.main", marginLeft: "auto", marginRight: 0 }}
            size="1rem"
          />
        )}
      </Stack>
      {children}
    </Stack>
  )
}
