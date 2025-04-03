import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { optionTradeService } from "@/services/optionTradeService";
import { SubProfile } from "@/models/SubProfile";

interface ExitTier {
  exitTierPositionPercent: number;
  exitType: string;
  exitTypeValue: string;
  optionStopOffsetPercent: number;
  optionTargetOffsetPercent: number;
  stockStopOffsetPercent: number;
  stockTargetOffsetPercent: number;
}

interface TradeRequest {
  name: string;
  cancelAndResubmitOnPartial: boolean;
  dteMax: number;
  dteMin: number;
  entryOffsetPercent: number;
  entryType: string;
  useLaddering: boolean;
  maxDelta: number | null;
  minContractAsk: number;
  minDelta: number | null;
  minOpenInterest: number;
  minVolume: number;
  oiCapPercent: number;
  onlyTradeUnderlying: boolean;
  optionType: string;
  requireActiveBid: boolean;
  useBidAskMax: boolean;
  bidAskMax: number;
  ticker: string;
  totalDollarAmount: number;
  tradeUnderlying: boolean;
  breakUpOrder: boolean;
  orderBreaks: number;
  tradeAsSet: boolean;
  baSpreadDiff: number;
  account: string;
  exitTiers: ExitTier[];
}

interface OptionTradeState {
  subProfiles: TradeRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: OptionTradeState = {
  subProfiles: [],
  loading: false,
  error: null,
};

export const createSubProfile = createAsyncThunk(
  "optionTrade/createSubProfile",
  async (tradeRequest: SubProfile, { rejectWithValue }) => {
    try {
      await optionTradeService.createSubProfile(tradeRequest);
      return tradeRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create sub-profile");
    }
  }
);

const optionTradeSlice = createSlice({
  name: "optionTrade",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSubProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubProfile.fulfilled, (state, action: PayloadAction<TradeRequest>) => {
        state.loading = false;
        state.subProfiles.push(action.payload);
      })
      .addCase(createSubProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default optionTradeSlice.reducer;
