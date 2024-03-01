import { combineReducers, combineSlices } from "@reduxjs/toolkit"
import { walletsSlice } from "./Slices/WalletsSlice"

const rootReducer = combineReducers({
  walletsReducer: combineSlices(walletsSlice),
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
