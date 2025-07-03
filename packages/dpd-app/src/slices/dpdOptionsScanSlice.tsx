import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { dpdOptionsScanService } from "@/services/dpdOptionsScanService";

export interface ExitTier {
  exitTierPositionPercent: number;
  exitType: string;
  exitTypeValue: number | string;
  optionStopOffsetPercent: number;
  optionTargetOffsetPercent: number;
  stockStopOffsetPercent: number;
  stockTargetOffsetPercent: number;
}

export interface StrategySettings {
  cancelAndResubmitOnPartial: boolean;
  dteMin: number;
  dteMax: number;
  entryOffsetPercent: number;
  entryType: number;
  exitTiers: ExitTier[];
  maxDelta: number | null;
  minContractAsk: number;
  minDelta: number | null;
  minOpenInterest: number;
  minVolume: number;
  baSpreadDiff: number;
  oiCapPercent: number;
  optionType: string;
  requireActiveBid: boolean;
  ticker: string;
  totalDollarAmount: number;
  tradeUnderlying: boolean;
  onlyTradeUnderlying: boolean;
  breakUpOrder: boolean;
  orderBreaks: number;
  tradeAsSet: boolean;
}

export interface SubProfiles {
  accountNumber: string;
  state: number;
  strategySettings: StrategySettings;
}


interface dpdOptionsScanState {
  loading: boolean;
  error: string | null;
  lastScanResult: any | null;
}

const initialState: dpdOptionsScanState = {
  loading: false,
  error: null,
  lastScanResult: null,
};

export const scanSchwab = createAsyncThunk(
  "dpdOptionsScan/scanSchwab",
  async (scanRequest: SubProfiles, { rejectWithValue }) => {
    try {
      const data = await dpdOptionsScanService.scanSchwab(scanRequest);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to perform Schwab scan");
    }
  }
);

const dpdOptionsScanSlice = createSlice({
  name: "dpdOptionsScan",
  initialState,
  reducers: {
    clearScanResult(state) {
      state.lastScanResult = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanSchwab.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastScanResult = null;
      })
      .addCase(scanSchwab.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.lastScanResult = action.payload;
      })
      .addCase(scanSchwab.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearScanResult } = dpdOptionsScanSlice.actions;

export default dpdOptionsScanSlice.reducer;