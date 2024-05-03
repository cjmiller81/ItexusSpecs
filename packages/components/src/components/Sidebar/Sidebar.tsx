import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import { Box, Divider, IconButton } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useState } from "react"
import { SidebarSection } from "./SidebarSection"
import { StyledDrawer } from "./StyledDrawer"
import { StyledDrawerHeader } from "./StyledDrawerHeader"
import { SidebarItems } from "./types"
interface Props {
  open: boolean
  sidebarItems: SidebarItems[]
  //eslint-disable-next-line no-unused-vars
  toggleSide: (open: boolean) => void
}

export function Sidebar({ open, toggleSide, sidebarItems }: Props) {
  const theme = useTheme()
  const [sidebarMenuItems, setSidebarMenuItems] = useState(sidebarItems)
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
      <>
        <StyledDrawerHeader>
          <IconButton onClick={() => toggleSide(false)}>
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
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
      </>
    </StyledDrawer>
  )
}
