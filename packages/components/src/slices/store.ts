import { asyncThunkCreator, buildCreateSlice, combineReducers, configureStore } from "@reduxjs/toolkit"
import { walletsSlice } from "./walletsSlice"
import { uiSlice } from "./uiSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { krakenSlice } from "./krakenSlice"
import { billingSlice } from "./billingSlice"
import { userProfileSlice } from "./userProfileSlice"

const reducers = {
  ui: uiSlice.reducer,
  wallets: walletsSlice.reducer,
  kraken: krakenSlice.reducer,
  billing: billingSlice.reducer,
  userProfile: userProfileSlice.reducer
}
const rootReducer = combineReducers(reducers)

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore["dispatch"]
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export type AppStore = ReturnType<typeof makeStore>

