import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { Box } from "@mui/material"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import { useTheme } from "@mui/material/styles"
import { useState } from "react"
import { getSidebarMenuItems } from "./consts"
import { SidebarSection } from "./SidebarSection"
import { StyledDrawer, StyledDrawerHeader } from "./StyledDrawer"

interface Props {
  open: boolean
  //eslint-disable-next-line no-unused-vars
  toggleSide: (open: boolean) => void
}

export default function Sidebar({ open, toggleSide }: Props) {
  const theme = useTheme()
  const [sidebarMenuItems, setSidebarMenuItems] = useState(getSidebarMenuItems())
  const handleSetItemOpen = (title: string, index: number, newOpen: boolean) => {
    const newState = sidebarMenuItems.map((menuItem, menuItemIndex) =>
      menuItemIndex === index
        ? {
            title: menuItem.title,
            sidebarListItems: menuItem.sidebarListItems.map(item =>
              item.title === title ? { ...item, open: newOpen } : { ...item, open: false },
            ),
          }
        : menuItem,
    )

    setSidebarMenuItems(newState)
  }

  return (
    <StyledDrawer
      variant="permanent"
      open={open}>
      <StyledDrawerHeader>
        <IconButton onClick={() => toggleSide(false)}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </StyledDrawerHeader>

      {sidebarMenuItems.map((item, index) => {
        return (
          <Box key={index}>
            <SidebarSection
              sectionName={item.title}
              items={item.sidebarListItems}
              onSetItemOpen={(title, open) => handleSetItemOpen(title, index, open)}
              open={open}
              toggleSide={toggleSide}
            />

            {index !== sidebarMenuItems.length - 1 && <Divider />}
          </Box>
        )
      })}
    </StyledDrawer>
  )
}
