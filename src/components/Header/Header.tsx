import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Box } from '@mui/material'
import { StyledAppBar } from './StyledAppBar'

import { useRouter } from 'next/router'
import { formatPath } from './helper'

import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

interface Props {
  open: boolean
  toggleSide: Function
}

function Header({ open, toggleSide }: Props) {
  const router = useRouter()

  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => toggleSide(true)}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box display={'flex'} alignItems={'center'} flex={1}>
          <Typography variant="h6" noWrap component="div">
            {formatPath(router.asPath)}
          </Typography>
          <Box display={'flex'} flex={1} justifyContent={'flex-end'} gap={3}>
            <UserMenu />
            <ThemeToggle />
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  )
}

export default Header
