import * as React from "react"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Header from "@/components/Header/Header"
import Sidebar from "@/components/Sidebar/Sidebar"
import { StyledDrawerHeader } from "@/components/Sidebar/StyledDrawer"
import { styled } from "@mui/material/styles"

interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  const [openSide, setOpenSide] = React.useState(true)

  const toggleSidebar = (value: boolean) => setOpenSide(value)
  return (
    <StyledRoot sx={{ width: "100%" }}>
      <CssBaseline />
      <Header
        open={openSide}
        toggleSide={toggleSidebar}
      />
      <Sidebar
        open={openSide}
        toggleSide={toggleSidebar}
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
