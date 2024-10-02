import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetcher } from "utils/axios";

interface ConnectionStatusState {
  isConnected: boolean | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConnectionStatusState = {
  isConnected: null,
  loading: false,
  error: null,
};

export const fetchConnectionStatus = createAsyncThunk("connectionStatus/fetchStatus", async () => {
  const response = await fetcher("/api/checkTalosConnection");
  return response.isHealthy;
});

export const connectionStatusSlice = createSlice({
  name: "connectionStatus",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchConnectionStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnectionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isConnected = action.payload;
      })
      .addCase(fetchConnectionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch connection status";
      });
  },
});

export default connectionStatusSlice.reducer;
