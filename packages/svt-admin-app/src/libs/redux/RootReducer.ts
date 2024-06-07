import { ivlUsersSlice } from "@/features/strategies/ivl/users/ivlUsersSlice"
import { fifoSignalSlice } from "@/features/strategies/signals/fifiSignalSlice"
import { combineReducers } from "@reduxjs/toolkit"
import { uiSlice } from "components"
import { getPersistConfig } from "redux-deep-persist"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import {
  fifoTradeInstrumentsSlice
} from "@/features/strategies/tradeInstruments/fifoTradeInstrumentsSlice"

export const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  fifoSignals: fifoSignalSlice.reducer,
  fifoTradeInstruments: fifoTradeInstrumentsSlice.reducer,
  ivlUsers: ivlUsersSlice.reducer
})

const config = getPersistConfig<RootState>({
  key: "root",
  storage: storage,
  whitelist: ["ui.mode", "ui.sidebarOpened", "ui.accordions"],
  rootReducer,
})

export const persistedReducer = persistReducer(config, rootReducer)
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
