import { asyncThunkCreator, buildCreateSlice, combineReducers, configureStore } from "@reduxjs/toolkit";
import { walletsSlice } from "./walletsSlice";
import { uiSlice } from "./uiSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { krakenSlice } from "./krakenSlice";
import { billingSlice } from "./billingSlice";
import { dexSlice } from "./dexSlice";
import { reactourSlice } from "./reactourSlice";

const reducers = {
  ui: uiSlice.reducer,
  wallets: walletsSlice.reducer,
  kraken: krakenSlice.reducer,
  billing: billingSlice.reducer,
  dex: dexSlice.reducer,
  reactour: reactourSlice.reducer,
};
const rootReducer = combineReducers(reducers);

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
