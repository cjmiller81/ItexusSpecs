import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ticker } from "@/models/Ticker";
import { polygonTickerService } from "@/services/polygonTickerService";

interface TickerState {
  tickers: Ticker[];
  selectedTicker: Ticker | null;
  loading: boolean;
  error: string | null;
}

const initialState: TickerState = {
  tickers: [],
  selectedTicker: null,
  loading: false,
  error: null,
};

export const searchTickers = createAsyncThunk(
  "ticker/search",
  async (query: string, { rejectWithValue, signal }) => {
    try {
      const result = await polygonTickerService.searchTickers(query, signal);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search tickers");
    }
  }
);

export const fetchTickerBySymbol = createAsyncThunk(
  "ticker/fetchBySymbol",
  async (symbol: string, { rejectWithValue, signal }) => {
    try {
      const result = await polygonTickerService.getTickerBySymbol(symbol, signal);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch ticker");
    }
  }
);

export const tickerSlice = createSlice({
  name: "ticker",
  initialState,
  reducers: {
    clearTickers(state) {
      state.tickers = [];
      state.selectedTicker = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchTickers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTickers.fulfilled, (state, action: PayloadAction<Ticker[]>) => {
        state.loading = false;
        state.tickers = action.payload;
      })
      .addCase(searchTickers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTickerBySymbol.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickerBySymbol.fulfilled, (state, action: PayloadAction<Ticker>) => {
        state.loading = false;
        state.selectedTicker = action.payload;
      })
      .addCase(fetchTickerBySymbol.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTickers } = tickerSlice.actions;

