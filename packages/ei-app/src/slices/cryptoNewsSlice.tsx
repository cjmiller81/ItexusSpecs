import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { cryptoNewsService, NewsResponse } from "../services/cryptoNewsService";
import { AxiosError } from "axios";

export interface CryptoNewsState {
  newsByTicker: NewsResponse | null;
  newsByTickerAdvanced: NewsResponse | null;
  newsByCategory: NewsResponse | null;
  tickers: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const initialState: CryptoNewsState = {
  newsByTicker: null,
  newsByTickerAdvanced: null,
  newsByCategory: null,
  tickers: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
};

export const fetchNewsByTickerAsync = createAsyncThunk<
  NewsResponse,
  {
    tickers: string;
    items?: number;
    page?: number;
    extra_fields?: string;
    sortby?: string;
  },
  { rejectValue: string }
>(
  "cryptoNews/fetchNewsByTicker",
  async (params, { rejectWithValue }) => {
    try {
      const response = await cryptoNewsService.getNewsByTicker(params);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch news by ticker");
      }
      return rejectWithValue("Failed to fetch news by ticker");
    }
  }
);

export const fetchNewsByTickerAdvancedAsync = createAsyncThunk<
  NewsResponse,
  {
    tickersInclude?: string;
    tickersOnly?: string;
    items?: number;
    page?: number;
  },
  { rejectValue: string }
>(
  "cryptoNews/fetchNewsByTickerAdvanced",
  async (params, { rejectWithValue }) => {
    try {
      const response = await cryptoNewsService.getNewsByTickerAdvanced(params);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch news by advanced ticker filter");
      }
      return rejectWithValue("Failed to fetch news by advanced ticker filter");
    }
  }
);

export const fetchNewsByCategoryAsync = createAsyncThunk<
  NewsResponse,
  {
    section: string;
    items?: number;
    page?: number;
  },
  { rejectValue: string }
>(
  "cryptoNews/fetchNewsByCategory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await cryptoNewsService.getNewsByCategory(params);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch news by category");
      }
      return rejectWithValue("Failed to fetch news by category");
    }
  }
);

export const fetchTickersAsync = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>(
  "cryptoNews/fetchTickers",
  async (_, { rejectWithValue }) => {
    try {
      const tickers = await cryptoNewsService.getTickers();
      return tickers;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch tickers");
      }
      return rejectWithValue("Failed to fetch tickers");
    }
  }
);

export const cryptoNewsSlice = createSlice({
  name: "cryptoNews",
  initialState,
  reducers: {
    clearNewsByTicker(state) {
      state.newsByTicker = null;
      state.error = null;
    },
    clearNewsByTickerAdvanced(state) {
      state.newsByTickerAdvanced = null;
      state.error = null;
    },
    clearNewsByCategory(state) {
      state.newsByCategory = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch news by ticker
      .addCase(fetchNewsByTickerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsByTickerAsync.fulfilled, (state, action: PayloadAction<NewsResponse>) => {
        state.loading = false;
        // Append new data to existing data
        if (state.newsByTicker && state.currentPage > 1) {
          state.newsByTicker = {
            ...action.payload,
            data: [...state.newsByTicker.data, ...action.payload.data],
          };
          // If no new data returned, we've reached the end
          if (action.payload.data?.length === 0) {
            state.totalPages = state.currentPage; // Set totalPages to current to hide Load More
          }
        } else {
          state.newsByTicker = action.payload;
        }
        state.totalPages = action.payload.total_pages;
        state.totalItems = action.payload.total_items;
      })
      .addCase(fetchNewsByTickerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch news by ticker";
      })
      
      // Fetch news by ticker advanced
      .addCase(fetchNewsByTickerAdvancedAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsByTickerAdvancedAsync.fulfilled, (state, action: PayloadAction<NewsResponse>) => {
        state.loading = false;
        // Append new data to existing data
        if (state.newsByTickerAdvanced && state.currentPage > 1) {
          state.newsByTickerAdvanced = {
            ...action.payload,
            data: [...state.newsByTickerAdvanced.data, ...action.payload.data],
          };
        } else {
          state.newsByTickerAdvanced = action.payload;
        }
        state.totalPages = action.payload.total_pages;
        state.totalItems = action.payload.total_items;
      })
      .addCase(fetchNewsByTickerAdvancedAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch news by advanced ticker filter";
      })
      
      // Fetch news by category
      .addCase(fetchNewsByCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsByCategoryAsync.fulfilled, (state, action: PayloadAction<NewsResponse>) => {
        state.loading = false;
        // Append new data to existing data
        if (state.newsByCategory && state.currentPage > 1) {
          state.newsByCategory = {
            ...action.payload,
            data: [...state.newsByCategory.data, ...action.payload.data],
          };
          // If no new data returned, we've reached the end
          if (action.payload.data?.length === 0) {
            state.totalPages = state.currentPage; // Set totalPages to current to hide Load More
          }
        } else {
          state.newsByCategory = action.payload;
        }
        state.totalPages = action.payload.total_pages;
        state.totalItems = action.payload.total_items;
      })
      .addCase(fetchNewsByCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch news by category";
      })
      
      // Fetch tickers
      .addCase(fetchTickersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickersAsync.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.tickers = action.payload;
      })
      .addCase(fetchTickersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tickers";
      });
  },
});

export const {
  clearNewsByTicker,
  clearNewsByTickerAdvanced,
  clearNewsByCategory,
  clearError,
  setCurrentPage,
} = cryptoNewsSlice.actions;

