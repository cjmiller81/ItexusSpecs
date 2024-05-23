import { toggleSideBar, useAppDispatch, useAppSelector } from "components"
import { useTheme } from "@mui/material/styles"
import { useEffect } from "react"
interface Props {
  children: any
}

export function AutoSidebarLayout({ children }: Props) {
  const dispatch = useAppDispatch()
  const { sidebarOpened } = useAppSelector(state => state.ui)
  const theme = useTheme()

  const handleResize = () => {
    if (window.innerWidth < theme.breakpoints.values.md && sidebarOpened) {
      dispatch(toggleSideBar({open: false}))
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
