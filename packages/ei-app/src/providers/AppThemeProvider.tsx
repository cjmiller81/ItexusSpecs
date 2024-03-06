"use client"

import { useAppSelector } from "@/libs/redux/Store"
import { getAppTheme } from "@/utils/theme"
import { createTheme, ThemeProvider } from "@mui/material"
import { ReactNode, useMemo } from "react"

interface Props {
  readonly children: ReactNode
}

export const AppThemeProvider = ({ children }: Props) => {
  const { mode } = useAppSelector(store => store.walletsReducer.ui)

  const theme = useMemo(() => createTheme(getAppTheme(mode)), [mode])

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
