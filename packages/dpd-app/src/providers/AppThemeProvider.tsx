"use client"


import { getAppTheme } from "components"
import { createTheme, ThemeProvider } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { useAppSelector } from "../libs/redux/Store"

interface Props {
  readonly children: ReactNode
}

export const AppThemeProvider = ({ children }: Props) => {
  const { mode } = useAppSelector(store => store.ui)

  const theme = useMemo(() => createTheme(getAppTheme(mode)), [mode])

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}