import { combineReducers, combineSlices } from "@reduxjs/toolkit"
import { getPersistConfig } from "redux-deep-persist"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { allTokensTableSlice } from "./Slices/AllTokensTableSlice"
import { IconsSlice } from "./Slices/IconsSlice"
import { marketCapEqualWeightChartSlice } from "./Slices/MarketCapEqualWeightChartSlice"
import { marketCapEqualWeightModelingSlice } from "./Slices/MarketCapEqualWeightModelingSlice"
import { marketCapWeightedChartSlice } from "./Slices/MarketCapWeightedChartSlice"
import { marketCapWeightedModelingSlice } from "./Slices/MarketCapWeightedModelingSlice"
import { uiSlice } from "./Slices/UiSlice"
import { walletWorthChartSlice } from "./Slices/WalletWorthChartSlice"
import { walletsSlice } from "./Slices/WalletsSlice"

export const rootReducer = combineReducers({
  walletsReducer: combineSlices(
    uiSlice,
    walletsSlice,
    walletWorthChartSlice,
    IconsSlice,
    marketCapEqualWeightChartSlice,
    marketCapEqualWeightModelingSlice,
    marketCapWeightedChartSlice,
    marketCapWeightedModelingSlice,
    allTokensTableSlice,
  ),
})

const config = getPersistConfig<RootState>({
  key: "root",
  storage: storage,
  whitelist: ["walletsReducer.ui.mode", "walletsReducer.ui.sidebarOpened", "walletsReducer.ui.accordions"],
  rootReducer,
})

export const persistedReducer = persistReducer(config, rootReducer)

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
