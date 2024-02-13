import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import { CustomThemeContext } from '@/themes/CustomThemeContext'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

function Header() {
  const colorMode = React.useContext(CustomThemeContext)

  return (
    <IconButton color="inherit" onClick={colorMode.toggle}>
      {colorMode.currentTheme === 'dark' ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  )
}

export default Header
