import Header from "@/components/Header/Header"
import Sidebar from "@/components/Sidebar/Sidebar"
import { StyledDrawerHeader } from "@/components/Sidebar/StyledDrawer"
import { toggleSideBar } from "@/libs/redux/Slices/UiSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import { styled } from "@mui/material/styles"
import * as React from "react"
import "react-toastify/dist/ReactToastify.css"
interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  const { sidebarOpened } = useAppSelector(store => store.walletsReducer.ui)
  const dispatch = useAppDispatch()
  return (
    <StyledRoot sx={{ width: "100%" }}>
      <CssBaseline />
      <Header
        open={sidebarOpened}
        toggleSide={open => dispatch(toggleSideBar({ open }))}
      />
      <Sidebar
        open={sidebarOpened}
        toggleSide={open => dispatch(toggleSideBar({ open }))}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}>
        <StyledDrawerHeader />
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
