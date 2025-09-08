import LightMode from "@mui/icons-material/LightMode"
import NightlightRound from "@mui/icons-material/NightlightRound"
import { IconButton, PaletteMode } from "@mui/material"

type Props = {
  mode: PaletteMode
  onToggleMode: () => void
  styles?: object
}

export function ThemeToggler({ mode, onToggleMode, styles = {} }: Props) {
  return (
    <IconButton
      id="ei-theme-toggle"
      sx={{ ...styles } }
      color="inherit"
      onClick={onToggleMode}>
      {mode === "dark" ? <LightMode /> : <NightlightRound stroke="black" />}
    </IconButton>
  )
}
