'use client'
import { ThemeProvider } from '@emotion/react'
import { PaletteMode, createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useMemo, useState } from 'react'
import { CustomThemeContext } from '@/themes/CustomThemeContext'
import Layout from './Layout'

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#03A9F4',
            light: '#E0F4FD',
          },
          success: {
            main: '#8BC34A',
            light: '#F1F7E9',
          },
          error: {
            light: '#FDE8E6',
            main: '#F64336',
          },
        }
      : {
          primary: {
            main: '#26BAFC',
            light: '#2F4355',
          },
          success: {
            main: '#8BC34A',
            light: '#404641',
          },
          error: {
            light: '#4C373E',
            main: '#F64336',
          },
          background: {
            paper: '#363640',
            default: '#363640',
          },
        }),
  },
})

export default function RootLayout({ children }: any) {
  const [mode, setMode] = useState<PaletteMode>('dark')

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  const contextValue = useMemo(
    () => ({
      currentTheme: mode,
      toggle: () => setMode(mode === 'light' ? 'dark' : 'light'),
    }),
    [mode],
  )

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Layout>{children}</Layout>
        </LocalizationProvider>
      </ThemeProvider>
    </CustomThemeContext.Provider>
  )
}
