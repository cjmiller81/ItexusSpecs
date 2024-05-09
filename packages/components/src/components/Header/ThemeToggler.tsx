import LightMode from "@mui/icons-material/LightMode"
import NightlightRound from "@mui/icons-material/NightlightRound"
import { IconButton, PaletteMode } from "@mui/material"

type Props = {
  mode: PaletteMode
  onToggleMode: () => void
}

export function ThemeToggler({ mode, onToggleMode }: Props) {
  return (
    <IconButton
      color="inherit"
      onClick={onToggleMode}>
      {mode === "dark" ? <LightMode /> : <NightlightRound stroke="black" />}
    </IconButton>
  )
}
