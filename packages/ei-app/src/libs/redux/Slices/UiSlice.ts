import { PaletteMode } from "@mui/material"
import { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../createAppSlice"

export type Status = "idle" | "loading" | "failed"
interface WalletsState {
  errors: string[]
  sidebarOpened: boolean
  mode: PaletteMode
}

const initialState: WalletsState = {
  errors: [],
  sidebarOpened: true,
  mode: "dark",
}

export const uiSlice = createAppSlice({
  name: "ui",
  initialState,
  reducers: create => ({
    clearErrors: create.reducer(state => {
      state.errors = []
    }),
    addError: create.reducer((state, action: PayloadAction<string>) => {
      state.errors.push(action.payload)
    }),
    toggleSideBar: create.reducer((state, action: PayloadAction<{ open: boolean }>) => {
      state.sidebarOpened = action.payload.open
    }),
    toggleTheme: create.reducer(state => {
      state.mode = state.mode === "dark" ? "light" : "dark"
    }),
  }),
})

export const { clearErrors, addError, toggleSideBar, toggleTheme } = uiSlice.actions
