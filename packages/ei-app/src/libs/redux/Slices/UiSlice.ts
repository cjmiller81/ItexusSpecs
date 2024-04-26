import { PaletteMode } from "@mui/material"
import { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../createAppSlice"

export type Status = "idle" | "loading" | "failed"
interface WalletsState {
  errors: string[]
  messages: string[]
  sidebarOpened: boolean
  mode: PaletteMode
  accordions: { [id: string]: boolean }
}

const initialState: WalletsState = {
  errors: [],
  messages: [],
  sidebarOpened: true,
  mode: "dark",
  accordions: {},
}

export const uiSlice = createAppSlice({
  name: "ui",
  initialState,
  reducers: create => ({
    clearErrors: create.reducer(state => {
      state.errors = []
    }),
    clearMessages: create.reducer(state => {
      state.messages = []
    }),
    addError: create.reducer((state, action: PayloadAction<string>) => {
      state.errors.push(action.payload)
    }),
    addMessage: create.reducer((state, action: PayloadAction<string>) => {
      state.messages.push(action.payload)
    }),
    toggleSideBar: create.reducer((state, action: PayloadAction<{ open: boolean }>) => {
      state.sidebarOpened = action.payload.open
    }),
    toggleTheme: create.reducer(state => {
      state.mode = state.mode === "dark" ? "light" : "dark"
    }),
    setAccordionState: create.reducer((state, action: PayloadAction<{ key: string; open: boolean }>) => {
      state.accordions = { ...state.accordions, [action.payload.key]: action.payload.open }
    }),
  }),
})

export const { clearErrors, addMessage, addError, toggleSideBar, toggleTheme, clearMessages, setAccordionState } = uiSlice.actions
