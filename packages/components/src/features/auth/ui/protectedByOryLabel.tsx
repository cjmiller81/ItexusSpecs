import { Box, Link, Typography } from "@mui/material"
import React from "react"

export const ProtectedByOryLabel = (): React.JSX.Element => {
  const termsUrl =
    process.env.NEXT_PUBLIC_APP_TERMS_URL || process.env.APP_TERMS_URL || ""

  const hasTerms = Boolean(termsUrl && termsUrl.trim().length > 0)

  return (
    <Box
      id="ory-branding"
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
      }}>
      {/* Left spacer (to balance Terms on the right) */}
      <Box />

      {/* Centered "Protected by Ory" */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}>
        <Typography
          color="#7d7d7d"
          fontSize=".625rem">
          Protected by
        </Typography>
        <img src="/oryIcon.svg" alt="Ory" />
      </Box>

      {/* Right-aligned Terms link */}
      {hasTerms && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            href={termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#7d7d7d",
              fontSize: ".625rem",
              textDecoration: "underline",
              "&:hover": {
                color: "#b0b0b0",
              },
            }}>
            Terms
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default ProtectedByOryLabel
