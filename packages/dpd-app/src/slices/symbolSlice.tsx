import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { symbolService } from "@/services/symbolService";
import { Instrument } from "./dpdOptionsScanSlice";

interface SymbolState {
  symbols: Instrument[];
  loading: boolean;
  error: string | null;
}

const initialState: SymbolState = {
  symbols: [],
  loading: false,
  error: null,
};

export const fetchMarketSymbolsRegex = createAsyncThunk(
  "symbol/fetchMarketSymbolsRegex",
  async (userInput: string, { rejectWithValue }) => {
    try {
      const response = await symbolService.searchMarketSymbolsRegex(userInput);
      return response.instruments;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch market symbols (regex)");
    }
  }
);

export const symbolSlice = createSlice({
  name: "symbol",
  initialState,
  reducers: {
    clearSymbols(state) {
      state.symbols = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketSymbolsRegex.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMarketSymbolsRegex.fulfilled,
        (state, action: PayloadAction<Instrument[]>) => {
          state.loading = false;
          state.symbols = action.payload;
        }
      )
      .addCase(fetchMarketSymbolsRegex.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSymbols } = symbolSlice.actions;

