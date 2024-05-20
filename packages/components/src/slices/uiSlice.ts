import { PaletteMode } from "@mui/material"
import { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "./createAppSlice"

export interface UiState {
  errors: string[]
  messages: string[]
  warnings: string[]
  sidebarOpened: boolean
  mode: PaletteMode
  accordions: { [id: string]: boolean }
}

const initialState: UiState = {
  errors: [],
  messages: [],
  warnings:[],
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
    clearWarnings: create.reducer(state => {
      state.warnings = []
    }),
    addError: create.reducer((state, action: PayloadAction<string>) => {
      state.errors.push(action.payload)
    }),
    addMessage: create.reducer((state, action: PayloadAction<string>) => {
      state.messages.push(action.payload)
    }),
    addWarning: create.reducer((state, action: PayloadAction<string>) => {
      state.warnings.push(action.payload)
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

export const { clearErrors, clearWarnings, addMessage, addWarning, addError, toggleSideBar, toggleTheme, clearMessages, setAccordionState } = uiSlice.actions
