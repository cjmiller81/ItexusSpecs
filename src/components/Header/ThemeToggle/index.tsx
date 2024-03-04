import { toggleTheme } from "@/libs/redux/Slices/UiSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import LightModeIcon from "@mui/icons-material/LightMode"
import NightlightRoundIcon from "@mui/icons-material/NightlightRound"
import IconButton from "@mui/material/IconButton"

function Header() {
  const { mode } = useAppSelector(store => store.walletsReducer.ui)
  const dispatch = useAppDispatch()
  return (
    <IconButton
      color="inherit"
      onClick={() => dispatch(toggleTheme())}>
      {mode === "dark" ? <LightModeIcon /> : <NightlightRoundIcon stroke="black" />}
    </IconButton>
  )
}

export default Header
