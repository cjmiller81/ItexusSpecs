import * as React from "react"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import { Box } from "@mui/material"
import { StyledAppBar } from "./StyledAppBar"
import ThemeToggle from "./ThemeToggle"
import UserMenu from "./UserMenu"
import MenuOpenIcon from "@mui/icons-material/MenuOpen"

interface Props {
  open: boolean
  toggleSide: Function
}

function Header({ open, toggleSide }: Props) {
  return (
    <StyledAppBar
      position="fixed"
      style={{ paddingRight: "0px important!" }}
      sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Toolbar sx={{ paddingLeft: "17px ", width: "100%" }}>
        <IconButton
          aria-label="open drawer"
          onClick={() => toggleSide(!open)}
          edge="start"
          sx={{
            marginRight: 5,
          }}>
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Box
          display={"flex"}
          alignItems={"center"}
          flex={1}>
          <Typography
            color="textPrimary"
            variant="h6"
            noWrap
            component="div">
            Elan Insights
          </Typography>
          <Box
            display={"flex"}
            flex={1}
            justifyContent={"flex-end"}
            gap={3}>
            <ThemeToggle />
            <Box sx={{ mr: 1 }}>
              <UserMenu />
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  )
}

export default Header
