import { CircularProgress, Paper, Typography } from "@mui/material"
import { Box, Stack, StackProps, useTheme } from "@mui/system"
import { FC, ReactNode } from "react"

export type DashboardTileProps = StackProps & {
  title: string
  icon: ReactNode
  loading?: boolean
  rightComponent?: ReactNode // Optional rightComponent prop
}

export const DashboardTile: FC<DashboardTileProps> = ({
                                                        title,
                                                        icon,
                                                        children,
                                                        loading,
                                                        rightComponent,
                                                        sx,
                                                        ...props
                                                      }) => {
  const theme = useTheme()
  return (
    <Stack
      sx={{
        ...sx,
      }}
      {...props}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between" // Adjust alignment to space-between
        gap={1}>
        <Stack direction="row" alignItems="center" gap={1}>
          {icon}
          <Typography
            sx={{ pt: "2px", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
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
        {rightComponent && (
          <Box sx={{ ml: "auto" }}> {/* Ensure rightComponent is aligned to the right */}
            {rightComponent}
          </Box>
        )}
      </Stack>
      <Paper sx={{ boxShadow: theme.shadows?.[8] }}>{children}</Paper>
    </Stack>
  )
}
