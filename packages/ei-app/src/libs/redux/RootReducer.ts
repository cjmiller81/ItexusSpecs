import { vaultsApi } from "@/features/Income/VaultsApi";
import { categoriesApi } from "@/features/Investing/categoriesApi";
import { chainsApi } from "@/features/Investing/chainsApi";
import { calendarEventsApi } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import { defisApi } from "@/features/Income/DefiApi";
import { combineReducers } from "@reduxjs/toolkit";
import { uiSlice, walletsSlice } from "components";
import { getPersistConfig } from "redux-deep-persist";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { allTokensTableSlice } from "./Slices/AllTokensTableSlice";
import { dashboardSlice } from "./Slices/DashboardSlice";
import { marketCapEqualWeightChartSlice } from "./Slices/MarketCapEqualWeightChartSlice";
import { marketCapEqualWeightModelingSlice } from "./Slices/MarketCapEqualWeightModelingSlice";
import { marketCapWeightedChartSlice } from "./Slices/MarketCapWeightedChartSlice";
import { marketCapWeightedModelingSlice } from "./Slices/MarketCapWeightedModelingSlice";
import { walletWorthChartSlice } from "./Slices/WalletWorthChartSlice";

export const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  wallets: walletsSlice.reducer,
  walletWorthChart: walletWorthChartSlice.reducer,
  marketCapEqualWeightChart: marketCapEqualWeightChartSlice.reducer,
  marketCapEqualWeightModeling: marketCapEqualWeightModelingSlice.reducer,
  marketCapWeightedChart: marketCapWeightedChartSlice.reducer,
  marketCapWeightedModeling: marketCapWeightedModelingSlice.reducer,
  allTokensTable: allTokensTableSlice.reducer,
  [vaultsApi.reducerPath]: vaultsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [chainsApi.reducerPath]: chainsApi.reducer,
  [dashboardSlice.name]: dashboardSlice.reducer,
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
