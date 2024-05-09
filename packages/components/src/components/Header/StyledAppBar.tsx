import { styled } from "@mui/material/styles"
import { AppBar, AppBarProps } from "@mui/material"

interface CustomAppBarProps extends AppBarProps {
  open?: boolean
}

export const StyledAppBar:any = styled(AppBar, {
  shouldForwardProp: prop => prop !== "open",
})<CustomAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: "100%",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))
