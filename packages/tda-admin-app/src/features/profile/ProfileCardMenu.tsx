import LockOutlined from "@ant-design/icons/LockOutlined"
import UserOutlined from "@ant-design/icons/UserOutlined"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

function getPathIndex(asPath: string) {
  let selectedTab = 0
  switch (asPath) {
    case "/profile/details":
      selectedTab = 0
      break
    case "/profile/password":
      selectedTab = 1
      break
    default:
      selectedTab = 0
  }

  return selectedTab
}

export default function ProfileCardMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation("ProfileCardMenu")
  const [selectedIndex, setSelectedIndex] = useState(getPathIndex(pathname!))
  const handleListItemClick = (index: number, route: string) => {
    setSelectedIndex(index)
    router.replace(route)
  }

  useEffect(() => {
    setSelectedIndex(getPathIndex(pathname!))
  }, [pathname])

  return (
    <List
      component="nav"
      sx={{ p: 0, "& .MuiListItemIcon-root": { minWidth: 32, color: "grey.500" } }}>
      <ListItemButton
        selected={selectedIndex === 0}
        onClick={() => handleListItemClick(0, "/profile/details")}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary={t("PersonalInformation")} />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 1}
        onClick={() => handleListItemClick(1, "/profile/password")}>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary={t("ChangePassword")} />
      </ListItemButton>
    </List>
  )
}
