import { stockApi } from "@/features/stockApi"
import { stockSlice } from "@/features/strategies/stockSlice"

import { combineReducers } from "@reduxjs/toolkit"
import { uiSlice } from "components"
import { getPersistConfig } from "redux-deep-persist"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"


export const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  stocks: stockSlice.reducer,
  [stockApi.reducerPath]: stockApi.reducer,
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