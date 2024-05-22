import { getSidebarMenuItems } from "@/constants/sidebar"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { CssBaseline } from "@mui/material"
import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import { Header, Sidebar, toggleSideBar, StyledDrawerHeader, toggleTheme } from "components"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import "react-toastify/dist/ReactToastify.css"
interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  const { sidebarOpened, mode } = useAppSelector(store => store.ui)
  const dispatch = useAppDispatch()
  const sideBarOptions = useMemo(getSidebarMenuItems, [])
  const { t } = useTranslation("Header")

  return (
    <StyledRoot sx={{ width: "100%" }}>
      <Header
        mode={mode}
        toggleTheme={() => dispatch(toggleTheme())}
        open={sidebarOpened}
        toggleSide={open => dispatch(toggleSideBar({ open: open }))}
        title={t("Echo")}
        defaultAvatar="/defaultAvatar.png"
      />
      <Sidebar
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
