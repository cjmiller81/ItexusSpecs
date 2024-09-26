import { calendarEventsApi } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import { defisApi } from "@/features/Income/DefiApi";
import { categoriesApi } from "@/features/Investing/categoriesApi";
import { chainsApi } from "@/features/Investing/chainsApi";
// import { vaultsApi } from "@/libs/yourApiPath"; // Adjust this import based on your actual file structure
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
import { vaultsApi } from "@/features/Income/VaultsApi";

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
  [calendarEventsApi.reducerPath]: calendarEventsApi.reducer,
  [defisApi.reducerPath]: defisApi.reducer,
  [vaultsApi.reducerPath]: vaultsApi.reducer, // Add vaultsApi reducer here
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
