import { styled } from "@mui/material"
import { AuthContainer } from "./AuthContainer"

export const StyledAuthContainer = styled(AuthContainer)(({ theme }) => ({
  backgroundColor: "#3E3E3E",
  height: "100vh",
  [theme.breakpoints.down(640)]: {
    backgroundColor: "#2B2B2B",
  },
}))
