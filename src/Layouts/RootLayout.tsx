'use client'
import { ThemeProvider } from '@emotion/react'
import { PaletteMode, createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useMemo, useState } from 'react'
import { CustomThemeContext } from '@/themes/CustomThemeContext'
import Layout from './Layout'
import Head from 'next/head'
import { getAppTheme } from '@/utils/theme'

export default function RootLayout({ children }: any) {
  const [mode, setMode] = useState<PaletteMode>('dark')

  const theme = useMemo(() => createTheme(getAppTheme(mode)), [mode])

  const contextValue = useMemo(
    () => ({
      currentTheme: mode,
      toggle: () => setMode(mode === 'light' ? 'dark' : 'light'),
    }),
    [mode],
  )

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <CustomThemeContext.Provider value={contextValue}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Layout>{children}</Layout>
          </LocalizationProvider>
        </ThemeProvider>
      </CustomThemeContext.Provider>
    </>
  )
}
