import { getSidebarMenuItems } from "@/constants/sidebar"
import { CssBaseline, useTheme } from "@mui/material"
import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import {
  Header,
  Sidebar,
  StyledDrawerHeader,
  toggleSideBar,
  toggleTheme,
  useAppDispatch,
  useAppSelector,
  useOry,
} from "components"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "react-toastify/dist/ReactToastify.css"
interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  const { sidebarOpened, mode } = useAppSelector(store => store.ui)
   const theme = useTheme()
  const dispatch = useAppDispatch()
  const { session, logOut } = useOry()
  const { t } = useTranslation("Header")
  const [sideBarOptions, setSideBarOptions] = useState(() => getSidebarMenuItems(theme))

   useEffect(() => {
      setSideBarOptions(getSidebarMenuItems(theme)) 
    },[session])

  return (
    <StyledRoot sx={{ width: "100%" }}>
      <Header
        logOut={logOut}
        defaultAvatar="/defaultAvatar.png"
        avatarUrl={session?.identity?.traits.avatarUrl}
        mode={mode}
        toggleTheme={() => dispatch(toggleTheme())}
        open={sidebarOpened}
        toggleSide={open => dispatch(toggleSideBar({ open: open }))}
        title={t("ECOSTrading")}
      />
      <Sidebar
        // TODO Add sidebar menu items here.
        sidebarItems={sideBarOptions}
        open={sidebarOpened}
        toggleSide={open => dispatch(toggleSideBar({ open: open }))}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}>
        <StyledDrawerHeader />
        <CssBaseline />
        {children}
      </Box>
    </StyledRoot>
  )
}

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "inherit",
  },
}))
