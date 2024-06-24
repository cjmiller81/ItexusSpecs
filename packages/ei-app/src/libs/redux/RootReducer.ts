import { combineReducers } from "@reduxjs/toolkit"
import { uiSlice, walletsSlice } from "components"
import { getPersistConfig } from "redux-deep-persist"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { allTokensTableSlice } from "./Slices/AllTokensTableSlice"
import { IconsSlice } from "./Slices/IconsSlice"
import { marketCapEqualWeightChartSlice } from "./Slices/MarketCapEqualWeightChartSlice"
import { marketCapEqualWeightModelingSlice } from "./Slices/MarketCapEqualWeightModelingSlice"
import { marketCapWeightedChartSlice } from "./Slices/MarketCapWeightedChartSlice"
import { marketCapWeightedModelingSlice } from "./Slices/MarketCapWeightedModelingSlice"
import { walletWorthChartSlice } from "./Slices/WalletWorthChartSlice"
import { dashboardSlice } from "./Slices/DashboardSlice"
import { newsApi } from "./Apis/NewsApi"

export const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  wallets: walletsSlice.reducer,
  walletWorthChart: walletWorthChartSlice.reducer,
  icons: IconsSlice.reducer,
  marketCapEqualWeightChart: marketCapEqualWeightChartSlice.reducer,
  MarketCapEqualWeightModeling: marketCapEqualWeightModelingSlice.reducer,
  marketCapWeightedChart: marketCapWeightedChartSlice.reducer,
  MarketCapWeightedModeling: marketCapWeightedModelingSlice.reducer,
  allTokensTable: allTokensTableSlice.reducer,
  [dashboardSlice.name]: dashboardSlice.reducer,
  [newsApi.reducerPath]: newsApi.reducer
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
