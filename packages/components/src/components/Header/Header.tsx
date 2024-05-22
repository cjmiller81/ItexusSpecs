import Menu from "@mui/icons-material/Menu"
import MenuOpen from "@mui/icons-material/MenuOpen"
import { Box, IconButton, PaletteMode, Toolbar, Typography } from "@mui/material"
import { StyledAppBar } from "./StyledAppBar"
import { ThemeToggler } from "./ThemeToggler"
import { UserMenu } from "./UserMenu"

interface Props {
  open: boolean
  //eslint-disable-next-line no-unused-vars
  toggleSide: (open: boolean) => void
  toggleTheme: () => void
  mode: PaletteMode
  title: string
  defaultAvatar: string
  avatarUrl?: string
  logOut?: Function
}

export function Header({ open, toggleSide, toggleTheme, mode, title, defaultAvatar, avatarUrl, logOut }: Props) {
  const handleLogOut = logOut || (() => {})

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
          {open ? <MenuOpen /> : <Menu />}
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
            {title}
          </Typography>
          <Box
            display={"flex"}
            flex={1}
            justifyContent={"flex-end"}
            gap={3}>
            <ThemeToggler
              onToggleMode={toggleTheme}
              mode={mode}
            />
            <Box sx={{ mr: 1 }}>
              <UserMenu
                logOut={handleLogOut}
                defaultAvatar={defaultAvatar}
                avatarUrl={avatarUrl}
              />
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  )
}
