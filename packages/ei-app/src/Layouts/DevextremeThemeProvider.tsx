import { useAppSelector } from "@/libs/redux/Store"
import { BoxProps } from "@mui/material"
import themes from "devextreme/ui/themes"
import { useEffect } from "react"

export default function DevextremeThemeProvider({ children }: BoxProps) {
  const mode = useAppSelector(store => store.walletsReducer.ui.mode)

  useEffect(() => {
    themes.current(mode === "dark" ? "material.blue.dark" : "material.blue.light")
  }, [mode])
  return <>{children}</>
}
