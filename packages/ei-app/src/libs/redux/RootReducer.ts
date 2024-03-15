import { combineReducers, combineSlices } from "@reduxjs/toolkit"
import { uiSlice } from "./Slices/UiSlice"
import { walletWorthChartSlice } from "./Slices/WalletWorthChartSlice"
import { walletsSlice } from "./Slices/WalletsSlice"

const rootReducer = combineReducers({
  walletsReducer: combineSlices(walletsSlice, uiSlice, walletWorthChartSlice),
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
