'use client'
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { SidebarListItem } from './consts'
import { useState } from 'react'
import Link from 'next/link'

interface Props {
  item: SidebarListItem
  isSidebarOpened: boolean
}

export default function SidebarItem({ item, isSidebarOpened }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
        onClick={() => setOpen(!open)}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isSidebarOpened ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {isSidebarOpened && (
          <>
            {item.children ? (
              <>
                <ListItemText
                  primary={item.title}
                  sx={{ opacity: isSidebarOpened ? 1 : 0 }}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
              </>
            ) : (
              <>
                <Link key={item.title} href={item.href} shallow>
                  <ListItemText primary={item.title} sx={{ opacity: 1 }} />
                </Link>
              </>
            )}
          </>
        )}
      </ListItemButton>
      {isSidebarOpened && item.children && (
        <Collapse in={open}>
          <List component="div">
            {item.children.map((child) => (
              <Link key={child.title} href={item.href} shallow>
                <ListItemButton>
                  <ListItemText primary={child.title} sx={{ ml: 10 }} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>
      )}
    </ListItem>
  )
}
