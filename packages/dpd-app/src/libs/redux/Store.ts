import { Action, ThunkAction, combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { persistStore } from "redux-persist"
import { RootState, persistedReducer } from "./RootReducer"
import { stockApi } from "@/features/stockApi"
import { highvolumescanApi } from "@/features/highVolumeScanApi"


const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        stockApi.middleware,
        highvolumescanApi.middleware,
      )
  })
}

export const appStore = makeStore()
export const appPersistor = persistStore(appStore)

export type AppDispatch = AppStore["dispatch"]
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export type AppStore = ReturnType<typeof makeStore>
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>
