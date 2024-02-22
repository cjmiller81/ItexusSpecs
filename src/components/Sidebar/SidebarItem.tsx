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
import Link from 'next/link'

interface Props {
  item: SidebarListItem
  isSidebarOpened: boolean
  open: boolean
  //eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void
}

export default function SidebarItem({
  item,
  isSidebarOpened,
  open,
  setOpen,
}: Props) {
  return (
    <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          px: 2.5,
          pl: 1.5,
        }}
        onClick={() => setOpen(!open)}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 1.5,
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {
          <>
            {item.children ? (
              <>
                <ListItemText primary={item.title} sx={{ opacity: 1 }} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </>
            ) : (
              <>
                {item.href ? (
                  <Link key={item.title} href={item.href} shallow>
                    <ListItemText primary={item.title} sx={{ opacity: 1 }} />
                  </Link>
                ) : (
                  <ListItemText primary={item.title} sx={{ opacity: 1 }} />
                )}
              </>
            )}
          </>
        }
      </ListItemButton>
      {item.children && (
        <Collapse in={!isSidebarOpened ? false : open}>
          <List component="div">
            {item.children.map((child) => (
              <Link key={child.title} href={child.href} shallow>
                <ListItemButton>
                  <ListItemText primary={child.title} sx={{ ml: 4 }} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>
      )}
    </ListItem>
  )
}
