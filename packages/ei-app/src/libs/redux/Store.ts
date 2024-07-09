import { defisApi } from "@/features/Income/DefiApi"
import { calendarEventsApi } from "@/libs/redux/Apis/CryptoCalendarApi"
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { persistStore } from "redux-persist"
import { newsApi } from "./Apis/NewsApi"
import { RootState, persistedReducer } from "./RootReducer"

const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(newsApi.middleware, calendarEventsApi.middleware, defisApi.middleware),
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
