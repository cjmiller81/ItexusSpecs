import { Box, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import { BoxProps } from "@mui/system"
import { FC } from "react"

type ProgressFooter = {
  secondsLeft: number
  totalSeconds: number
  handleReject: () => void
}

export const ProgressFooter: FC<ProgressFooter & BoxProps> = ({
  secondsLeft,
  totalSeconds,
  handleReject,
  sx,
  ...props
}) => {
  const isInProgress = secondsLeft !== 0
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...props}>
      <Box sx={{ width: "100%", pb: "3px", pr: "4px" }}>
        <Typography
          sx={{ float: "right", width: "fit-content" }}
          component="div">
          {isInProgress && `${secondsLeft.toFixed()} seconds`}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, width: 500 }}>
        <LinearProgress
          sx={{ marginTop: 0, borderRadius: 50 }}
          variant="determinate"
          value={(100 * secondsLeft) / totalSeconds}
        />
      </Box>
      <Box
        sx={{ pb: "2px", pl: 2 }}
        width="100%">
        {isInProgress && <Button onClick={handleReject}>Reject</Button>}
      </Box>
    </Box>
  )
}
