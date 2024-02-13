import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { StyledDrawer, StyledDrawerHeader } from './StyledDrawer'
import { ListSubheader } from '@mui/material'
import { PLATFORMS_ITEMS, TOOLS_ITEMS } from './consts'
import SidebarItem from './SidebarItem'

interface Props {
  open: boolean
  toggleSide: Function
}

export default function Sidebar({ open, toggleSide }: Props) {
  const theme = useTheme()

  return (
    <StyledDrawer variant="permanent" open={open}>
      <StyledDrawerHeader>
        <IconButton onClick={() => toggleSide(false)}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </StyledDrawerHeader>
      <Divider />
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        onClick={() => toggleSide(true)}
        aria-labelledby="platforms-subheader"
        subheader={
          <ListSubheader component="div" id="platforms-subheader">
            {open ? 'Platforms' : ''}
          </ListSubheader>
        }
      >
        {PLATFORMS_ITEMS.map((item) => (
          <SidebarItem key={item.title} item={item} isSidebarOpened={open} />
        ))}
      </List>
      <Divider />
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        onClick={() => toggleSide(true)}
        aria-labelledby="tools-subheader"
        subheader={
          <ListSubheader component="div" id="tools-subheader">
            {open ? 'Tools' : ''}
          </ListSubheader>
        }
      >
        {TOOLS_ITEMS.map((item) => (
          <SidebarItem key={item.title} item={item} isSidebarOpened={open} />
        ))}
      </List>
    </StyledDrawer>
  )
}
