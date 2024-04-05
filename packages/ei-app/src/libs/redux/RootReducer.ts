import { combineReducers, combineSlices } from "@reduxjs/toolkit"
import { IconsSlice } from "./Slices/IconsSlice"
import { marketCapEqualWeightModelingSlice } from "./Slices/MarketCapEqualWeightModelingSlice"
import { marketCapEqualWeightSlice } from "./Slices/MarketCapEqualWeightSlice"
import { uiSlice } from "./Slices/UiSlice"
import { walletWorthChartSlice } from "./Slices/WalletWorthChartSlice"
import { walletsSlice } from "./Slices/WalletsSlice"
import { allTokensTableSlice } from "./Slices/AllTokensTableSlice"

const rootReducer = combineReducers({
  walletsReducer: combineSlices(
    walletsSlice,
    uiSlice,
    walletWorthChartSlice,
    IconsSlice,
    marketCapEqualWeightSlice,
    marketCapEqualWeightModelingSlice,
    allTokensTableSlice,
  ),
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
