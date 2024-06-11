import { CSSObject, Drawer, Theme } from "@mui/material"
import { styled } from "@mui/material/styles"

const openedMixin = (theme: Theme): CSSObject => ({
  width: "600px",
  [theme.breakpoints.down("md")]: {
    width: "500px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "300px",
  },
  [theme.breakpoints.down("xs")]: {
    width: "100px",
  },
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down("md")]: {
    width: 0,
  },
  overflowX: "hidden",
  width: theme.spacing(4),
})

export const StyledDrawer: any = styled(Drawer, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}))
