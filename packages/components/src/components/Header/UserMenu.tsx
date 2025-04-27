import Logout from "@mui/icons-material/Logout"
import { Avatar } from "@mui/material"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import * as React from "react"
import { useTranslation } from "react-i18next"
import { AppLink } from "../common/AppLink"

type Props = {
  defaultAvatar: string
  avatarUrl?: string
  logOut: Function
}

export const UserMenu: React.FC<Props> = ({ defaultAvatar, avatarUrl, logOut }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

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
        <Avatar
          src={avatarUrl || defaultAvatar}
          sx={{ cursor: "pointer" }}></Avatar>
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
            <Avatar src={avatarUrl || defaultAvatar} /> {t("Profile")}
          </MenuItem>
        </AppLink>
        <Divider />
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
