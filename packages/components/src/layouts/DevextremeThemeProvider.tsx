
import { BoxProps } from "@mui/material"
import themes from "devextreme/ui/themes"
import { useEffect } from "react"
import { useAppSelector } from "../slices"

export default function DevextremeThemeProvider({ children }: BoxProps) {
  const mode = useAppSelector(store => store.ui.mode)

  useEffect(() => {
    themes.current(mode === "dark" ? "material.blue.dark" : "material.blue.light")
  }, [mode])
  return <>{children}</>
}
