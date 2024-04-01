import { combineReducers, combineSlices } from "@reduxjs/toolkit"
import { uiSlice } from "./Slices/UiSlice"
import { walletWorthChartSlice } from "./Slices/WalletWorthChartSlice"
import { walletsSlice } from "./Slices/WalletsSlice"
import { IconsSlice } from "./Slices/IconsSlice"
import { marketCapEqualWeightSlice } from "./Slices/MarketCapEqualWeightSlice"

const rootReducer = combineReducers({
  walletsReducer: combineSlices(walletsSlice, uiSlice, walletWorthChartSlice, IconsSlice, marketCapEqualWeightSlice),
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
