import { toggleSideBar } from "@/libs/redux/Slices/UiSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { useTheme } from "@mui/material/styles"
import { useEffect } from "react"
interface Props {
  children: any
}

export default function AutoSidebarLayout({ children }: Props) {
  const dispatch = useAppDispatch()
  const { sidebarOpened } = useAppSelector(state => state.walletsReducer.ui)
  const theme = useTheme()

  const handleResize = () => {
    if (window.innerWidth < theme.breakpoints.values.md && sidebarOpened) {
      dispatch(toggleSideBar({ open: false }))
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  })

  return children
}
