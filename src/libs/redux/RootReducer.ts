import { combineReducers, combineSlices } from "@reduxjs/toolkit"
import { uiSlice } from "./Slices/UiSlice"
import { walletsSlice } from "./Slices/WalletsSlice"

const rootReducer = combineReducers({
  walletsReducer: combineSlices(walletsSlice, uiSlice),
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
