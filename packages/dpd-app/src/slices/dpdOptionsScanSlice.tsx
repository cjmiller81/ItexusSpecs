import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { dpdOptionsScanService, SchwabScanRequest } from "@/services/dpdOptionsScanService";
import { SubProfile } from "@/models/SubProfile";

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
  async (scanRequest: SubProfile, { rejectWithValue }) => {
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
