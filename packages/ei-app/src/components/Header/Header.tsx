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
import { useTranslation } from "react-i18next"

interface Props {
  open: boolean
  //eslint-disable-next-line no-unused-vars
  toggleSide: (open: boolean) => void
}

function Header({ open, toggleSide }: Props) {
  const { t } = useTranslation("Header")
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
            {t("ElanInsights")}
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
