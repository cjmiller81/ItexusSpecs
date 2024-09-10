import { defisApi } from "@/features/Income/DefiApi";
import { calendarEventsApi } from "@/libs/redux/Apis/CryptoCalendarApi";
import { combineReducers } from "@reduxjs/toolkit";
import { uiSlice, walletsSlice } from "components";
import { getPersistConfig } from "redux-deep-persist";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { newsApi } from "./Apis/NewsApi";
import { allTokensTableSlice } from "./Slices/AllTokensTableSlice";
import { dashboardSlice } from "./Slices/DashboardSlice";
import { marketCapEqualWeightChartSlice } from "./Slices/MarketCapEqualWeightChartSlice";
import { marketCapEqualWeightModelingSlice } from "./Slices/MarketCapEqualWeightModelingSlice";
import { marketCapWeightedChartSlice } from "./Slices/MarketCapWeightedChartSlice";
import { marketCapWeightedModelingSlice } from "./Slices/MarketCapWeightedModelingSlice";
import { walletWorthChartSlice } from "./Slices/WalletWorthChartSlice";
import { categoriesApi } from "@/features/Investing/categoriesApi";
import { chainsApi } from "@/features/Investing/chainsApi";

export const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  wallets: walletsSlice.reducer,
  walletWorthChart: walletWorthChartSlice.reducer,
  marketCapEqualWeightChart: marketCapEqualWeightChartSlice.reducer,
  MarketCapEqualWeightModeling: marketCapEqualWeightModelingSlice.reducer,
  marketCapWeightedChart: marketCapWeightedChartSlice.reducer,
  MarketCapWeightedModeling: marketCapWeightedModelingSlice.reducer,
  allTokensTable: allTokensTableSlice.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [chainsApi.reducerPath]: chainsApi.reducer,
  [dashboardSlice.name]: dashboardSlice.reducer,
  [newsApi.reducerPath]: newsApi.reducer,
  [calendarEventsApi.reducerPath]: calendarEventsApi.reducer,
  [defisApi.reducerPath]: defisApi.reducer,
});

const config = getPersistConfig<RootState>({
  key: "root",
  storage: storage,
  whitelist: ["ui.mode", "ui.sidebarOpened", "ui.accordions"],
  rootReducer,
});

export const persistedReducer = persistReducer(config, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
