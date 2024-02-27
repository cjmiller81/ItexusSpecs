import * as React from "react"
import { useTheme } from "@mui/material/styles"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { StyledDrawer, StyledDrawerHeader } from "./StyledDrawer"
import { Collapse, ListSubheader } from "@mui/material"
import { PLATFORMS_ITEMS, SidebarListItem, TOOLS_ITEMS } from "./consts"
import SidebarItem from "./SidebarItem"
import { useState } from "react"

interface Props {
  open: boolean
  toggleSide: Function
}

export default function Sidebar({ open, toggleSide }: Props) {
  const theme = useTheme()
  const [platformItems, setPlatformItems] = useState(PLATFORMS_ITEMS)
  const [toolsItems, setToolsItems] = useState(TOOLS_ITEMS)

  const handleSetItemOpen = (
    title: string,
    items: SidebarListItem[],
    newOpen: boolean,
    setNewItems: (items: SidebarListItem[]) => void, // eslint-disable-line no-unused-vars
  ) => {
    const newState = items.map(item => (item.title === title ? { ...item, open: newOpen } : { ...item, open: false }))

    setNewItems(newState)
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
      <Divider />
      <List
        sx={{ width: "100%", bgcolor: "background.paper" }}
        component="nav"
        onClick={() => toggleSide(true)}
        aria-labelledby="platforms-subheader"
        subheader={
          <Collapse
            orientation="vertical"
            in={open}>
            <ListSubheader
              component="div"
              id="platforms-subheader">
              {"Platforms"}
            </ListSubheader>
          </Collapse>
        }>
        {platformItems.map(item => (
          <SidebarItem
            key={item.title}
            item={item}
            open={item.open}
            setOpen={open => handleSetItemOpen(item.title, platformItems, open, newItems => setPlatformItems(newItems))}
            isSidebarOpened={open}
          />
        ))}
      </List>
      <Divider />
      <List
        sx={{ width: "100%", bgcolor: "background.paper" }}
        component="nav"
        onClick={() => toggleSide(true)}
        aria-labelledby="tools-subheader"
        subheader={
          <Collapse
            orientation="vertical"
            in={open}>
            <ListSubheader
              className="test"
              component="div"
              id="tools-subheader">
              {"Tools"}
            </ListSubheader>
          </Collapse>
        }>
        {toolsItems.map(item => (
          <SidebarItem
            key={item.title}
            item={item}
            open={item.open}
            setOpen={open => handleSetItemOpen(item.title, toolsItems, open, newItems => setToolsItems(newItems))}
            isSidebarOpened={open}
          />
        ))}
      </List>
    </StyledDrawer>
  )
}
