import { createContext } from "react"

export const CustomThemeContext = createContext({
  currentTheme: "dark",
  toggle: () => {},
})
