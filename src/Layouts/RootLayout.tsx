'use client'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { CustomThemeContext } from '@/themes/CustomThemeContext'
import Layout from './Layout'

export default function RootLayout({ children }: any) {
  const [mode, setMode] = useState('dark')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // @ts-expect-error
          mode,
        },
        shape: {
          borderRadius: 2,
        },
        typography: {
          button: {
            fontFamily: 'inherit',
          },
        },
      }),
    [mode],
  )

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
        <Layout>{children}</Layout>
      </ThemeProvider>
    </CustomThemeContext.Provider>
  )
}
