import { calendarEventsApi } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import { defisApi } from "@/features/Income/DefiApi";
import { categoriesApi } from "@/features/Investing/categoriesApi";
import { chainsApi } from "@/features/Investing/chainsApi";
import { exchangesApi } from "@/features/Investing/exchangesApi";
import { vaultsApi } from "@/features/Income/VaultsApi";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import { RootState, persistedReducer } from "./RootReducer";
import { categoriesEventsApi } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import { dexsApi } from "@/features/Income/DexApi";
import { cexApi } from "@/features/tradeAggregator/TradeTableApi";

const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        vaultsApi.middleware,
        calendarEventsApi.middleware,
        categoriesEventsApi.middleware,
        defisApi.middleware,
        dexsApi.middleware,
        cexApi.middleware,
        chainsApi.middleware,
        exchangesApi.middleware,
        categoriesApi.middleware,
      ),
  });
};

export const appStore = makeStore();
export const appPersistor = persistStore(appStore);

export type AppDispatch = AppStore["dispatch"];
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppStore = ReturnType<typeof makeStore>;
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
