import { Box, Typography } from "@mui/material"
import React from "react"

export const ProtectedByOryLabel = (): React.JSX.Element => {
  return (
    <Box
      id="ory-branding"
      sx={{ display: "flex", gap: 0.5 }}>
      <Typography
        color="#7d7d7d"
        fontSize=".625rem">
        Protected by
      </Typography>
      <img src="/oryIcon.svg"></img>
    </Box>
  )
}

export default ProtectedByOryLabel
