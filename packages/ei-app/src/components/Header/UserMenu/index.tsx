import { useOry } from "components"
import { AppLink } from "@/components/common/AppLink"
import Logout from "@mui/icons-material/Logout"
import Settings from "@mui/icons-material/Settings"
import { Avatar } from "@mui/material"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import * as React from "react"
import { useTranslation } from "react-i18next"

function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { session, logOut } = useOry()

  let nameLetters = ""
  if (session) {
    const firstName = session.identity?.traits.name.first
    const lastName = session.identity?.traits.name.last
    nameLetters = `${firstName && firstName.length ? firstName[0] : ""}${lastName && lastName.length ? lastName[0] : ""}`
  }

  const open = Boolean(anchorEl)
  const { t } = useTranslation("UserMenu")

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onLogOut = async () => {
    await logOut()
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}>
        <Avatar sx={{ bgcolor: "coral", cursor: "pointer" }}>{nameLetters.toLocaleUpperCase()}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <AppLink
          passHref
          href={"/profile"}
          shallow>
          <MenuItem onClick={handleClose}>
            <Avatar /> {t("Profile")}
          </MenuItem>
        </AppLink>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t("Settings")}
        </MenuItem>
        <MenuItem onClick={onLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t("Logout")}
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default UserMenu
