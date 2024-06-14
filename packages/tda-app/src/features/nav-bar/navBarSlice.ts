import { PaletteMode } from "@mui/material"
import { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "components"

export interface UiState {
  sidebarOpened: boolean
  mode: PaletteMode
  openedItem?: string
  horizontalActiveItem?: string
}

const initialState: UiState = {
  sidebarOpened: true,
  mode: "dark",
}

export const uiSlice = createAppSlice({
  name: "ui",
  initialState,
  reducers: create => ({
    setOpenedItem: create.reducer((state, action: PayloadAction<{ openedItem?: string }>) => {
      state.openedItem = action.payload.openedItem
    }),
    setHorizontalActiveItem: create.reducer((state, action: PayloadAction<{ horizontalActiveItem?: string }>) => {
      state.horizontalActiveItem = action.payload.horizontalActiveItem
    }),
    toggleSideBar: create.reducer((state, action: PayloadAction<{ open: boolean }>) => {
      state.sidebarOpened = action.payload.open
    }),
    toggleTheme: create.reducer(state => {
      state.mode = state.mode === "dark" ? "light" : "dark"
    }),
  }),
})

export const { toggleSideBar, toggleTheme, setOpenedItem, setHorizontalActiveItem } = uiSlice.actions
