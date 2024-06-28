import { uiSlice } from "@/features/nav-bar/navBarSlice"
import { currenciesSlice } from "@/features/trading/rfq/slices/currenciesSlice"
import { rfqSlice } from "@/features/trading/rfq/slices/rfqSlice"
import { adminUsersSlice } from "features/users/adminUsersSlice"
import { combineReducers } from "@reduxjs/toolkit"
import { walletsSlice } from "components"
import { getPersistConfig } from "redux-deep-persist"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

export const rootReducer = combineReducers({
  [uiSlice.name]: uiSlice.reducer,
  wallets: walletsSlice.reducer,
  rfq: rfqSlice.reducer,
  currencies: currenciesSlice.reducer,
  adminUsers: adminUsersSlice.reducer,
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
