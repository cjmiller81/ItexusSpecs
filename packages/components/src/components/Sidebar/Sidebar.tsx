import ChevronLeft from "@mui/icons-material/ChevronLeft"
import ChevronRight from "@mui/icons-material/ChevronRight"
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
  const [opened, setOpened] = useState<{ [index: number]: { [title: string]: boolean } }>({})
  const handleSetItemOpen = (title: string, index: number, newOpen: boolean) => {
    const newOpened = { ...opened }
    newOpened[index] = { [title]: newOpen }
    setOpened(newOpened)
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

        {sidebarItems.map((item, sidebarItemindex) => {
          return (
            <Box key={sidebarItemindex}>
              <SidebarSection
                sectionName={item.title}
                items={item.sidebarListItems.map((item) => ({
                  ...item,
                  open: Boolean(opened[sidebarItemindex] ? opened[sidebarItemindex][item.title] : false),
                }))}
                onSetItemOpen={(title, open) => handleSetItemOpen(title, sidebarItemindex, open)}
                open={open}
                toggleSide={toggleSide}
              />

              {sidebarItemindex !== sidebarItems.length - 1 && <Divider />}
            </Box>
          )
        })}
      </>
    </StyledDrawer>
  )
}
